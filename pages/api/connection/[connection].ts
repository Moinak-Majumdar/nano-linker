import cron from 'node-cron';
import type { NextApiRequest, NextApiResponse } from 'next'
import url_collection from '@/database/schema/urlSchema';
import userDb from '@/database/schema/userSchema';
import connectMongo from '@/database/function/connectMongo'
import disconnectMongo from '@/database/function/disconnectMongo';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  const { connection } = req.query;

  if (req.method === 'POST') {

    switch (connection) {

      //hl1 create user during sign in  
      case 'createUser': {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ error: 'user can not be created without email.' })
        }

        try {
          const exists = await userDb.findOne({ "email": email })

          if (exists) {
            userDb.updateOne({ "email": email }, { "$set": { "sessionCount": exists["sessionCount"] + 1 } }, { "upsert": false }).then((result) => {
              const { matchedCount, modifiedCount } = result;
              if (matchedCount && modifiedCount) {
                return res.status(200).json({ success: 'User already exist!' })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            const doc = new userDb({ "email": email, "sessionCount": 1, "links": [] })
            const newDoc = doc.save();
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
                const schedule = cron.schedule('0 */1 * * *', async () => {
                  try {
                    const result = await url_collection.findByIdAndDelete(id);
                    console.log('link deleted')
                    if (result === null) {
                      schedule.stop()
                    }
                  } catch (error) {
                    console.log(error)
                  }
                })
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
        const { email, links } = req.body;
        if (!email || !links) {
          return res.status(400).json({ error: 'all fields are required.' })
        }
        userDb.findOne({ email: email }).then(async (exist) => {
          if (exist) {
            const inner = await userDb.find({'$and': [{"email": email}, { 'links': { "$elemMatch": links } }]})
            if (inner.length < 1) {
              const query = { "email": email }
              const update = { "$addToSet": { "links": links } }
              userDb.updateOne(query, update).then(d => {
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
        const { email } = req.body;

        if (!email) {
          return res.status(400).json({ error: 'user can not be created without email.' })
        }

        await userDb.findOne({ "email": email }).then((data) => {
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

        await userDb.updateOne({"_id": uid}, { '$pull': { "links": obj }}).then(async() => {
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
