import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    if (!session.isLoggedIn) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let count = 0;

    if (session.userId) {
      // Notifications pour un user (restaurant/admin)
      count = await prisma.notifications.count({
        where: {
          userId: session.userId,
          read: false,
        },
      });
    } else if (session.customerId) {
      // Notifications pour un customer
      count = await prisma.notifications.count({
        where: {
          customerId: session.customerId,
          read: false,
        },
      });
    }

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
