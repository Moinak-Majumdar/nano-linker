import cron from 'node-cron';
import type { NextApiRequest, NextApiResponse } from 'next'
import url_collection from '@/database/schema/urlSchema';
import userDb from '@/database/schema/userSchema';
import connectMongo from '@/database/function/connectMongo'
import disconnectMongo from '@/database/function/disconnectMongo';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'POST') {
    await connectMongo();
    const { connection } = req.query;

    switch (connection) {

      //hl1 create user during sign in  
      case 'createUser': {
        const { uid } = req.body;
        if (!uid) {
          return res.status(400).json({ error: 'user can not be created without uid.' })
        }

        try {
          const exists = await userDb.findOne({ "userId": uid })

          if (exists) {
            userDb.updateOne({ "userId": uid }, { "$set": { "sessionCount": exists["sessionCount"] + 1 } }, { "upsert": false }).then((result) => {
              const { matchedCount, modifiedCount } = result;
              if (matchedCount && modifiedCount) {
                return res.status(200).json({ success: 'User already exist!' })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            const doc = new userDb({ "userId": uid, "sessionCount": 1, "links": [] })
            const newDoc = await doc.save();
            if (newDoc) {
              return res.status(200).json({ success: 'User Created.' })
            } else {
              return res.status(400).json({ error: 'Failed to create user.' })
            }
          }
        } catch (error) {
          return res.status(400).json({ error })
        }
      }
        break;
      //hl2 generate nano link  
      case 'genLink': {
        const { url, isAuthenticated } = req.body;
        if (!url || !isAuthenticated) {
          return res.status(400).json({ error: 'all filed are required.' })
        }

        try {
          const exists = await url_collection.findOne({ "url": url })

          if (exists) {
            res.status(200).json({ slug: exists['slug'] })
          } else {
            const slug = Math.random().toString(36).substring(2, 9)
            const doc = new url_collection({ url, slug })
            const result = await doc.save();
            if (result) {
              res.status(200).json({ slug })
              if (isAuthenticated === 'unauthenticated') {
                const id = doc['_id']
                const delay = 12 * 60 * 60 * 1000;
                setTimeout(async() => {
                  try {
                    await url_collection.findByIdAndDelete(id);
                    console.log('link deleted')
                  } catch (error) {
                    console.log(error)
                  }
                }, delay)
              }
            } else {
              res.status(400).json({ error: 'Failed to generate Nano link' })
            }
          }
        } catch (error) {
          return res.status(400).json({ error })
        }
      }
        break;
      //hl3 nano link to redirect user  
      case 'redirect': {
        const { slug } = req.body;
        try {
          const data = await url_collection.findOne({ "slug": slug })
          if (data) {
            return res.status(200).json({ url: data['url'] })
          } else {
            return res.status(200).json({ url: 'expired' })
          }
        } catch (error) {
          console.log(error)
        }
      }
        break;
      // hl4  save nano link at user auth 
      case 'saveLinks': {
        const { uid, links } = req.body;
        if (!uid || !links) {
          return res.status(400).json({ error: 'all fields are required.' })
        }
        userDb.findOne({ "userId": uid }).then(async (exist) => {
          if (exist) {
            const inner = await userDb.find({'$and': [{"userId": uid}, { 'links': { "$elemMatch": links } }]})
            if (inner.length < 1) {
              userDb.updateOne({ "userId": uid }, { "$addToSet": { "links": links } }).then(() => {
                return res.status(200).json({ info: 'Nano Link saved.' })
              }).catch(err => {
                return res.status(400).json({ error: err })
              })
            } else {
              return res.status(200).json({ info: 'Nano link already exist' })
            }
          } else {
            return res.status(420).json({ error: 'invalid user!' })
          }
        }).catch(err => {
          return res.status(400).json({ error : err })
        })
      }
        break;
      // hl5   find all nano links of user  
      case 'getUserLinks': {
        const { uid } = req.body;

        if (!uid) {
          return res.status(400).json({ error: 'user can not be created without email.' })
        }

        await userDb.findOne({ "userId": uid }).then((data) => {
          return res.status(200).json({ data: data })
        }).catch(err => {
          console.log(err)
          return res.status(400).json({ data: 'user data not found!' })
        })

      }
        break
      // hl6  delete user saved link  
      case 'deleteLink': {
        const {uid, obj} = req.body;

        if(!uid || !obj) {
          return res.status(400).json({ error: 'link can not be deleted without uid and doc.' })
        }

        await userDb.updateOne({"userId": uid}, { '$pull': { "links": obj }}).then(async() => {
          await url_collection.deleteOne({"slug": obj.slug}).then(() => {
            return res.status(200).json({success: 'Link deleted'})
          }).catch(err => {
            console.log(err)
            return res.status(400).json({error: 'failed to delete link'})
          })
        }).catch(err => {
          console.log(err)
          return res.status(400).json({error: 'failed to delete link'})
        })
      
       }
        break;
      default:
        res.status(420).json({ error: 'Invalid api request !' })
        break;
    }
  } else {
    res.status(420).json({ error: 'Invalid request method !' })
  }
}
