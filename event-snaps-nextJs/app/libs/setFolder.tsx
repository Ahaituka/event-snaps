"use server"

import prisma from './prismadb'

export async function updateFolderId(userId: string, folderId: string) {
    return await prisma.account.update({
        where: { userId : userId },
        data: { folderId },
      })
  }
