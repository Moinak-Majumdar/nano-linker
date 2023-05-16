import url_collection from '@/database/schema/urlSchema';
import connectMongo from '@/database/function/connectMongo'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    await connectMongo()
    if(req.method === 'DELETE') {
        try {
            url_collection.deleteMany().then(() => {
                return res.status(200).json({ok: 'Deleted'})
            })
        } catch (error) {
            res.status(200).json({err: 'not Deleted'})
        }
    } else {
        res.status(420).json({ error: 'Invalid request method !' })
    }
}