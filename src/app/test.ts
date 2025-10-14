"use server"

import { cookies } from "next/headers"

export const getCookie = async () => {
    const cookie = await cookies()
    console.log("Access Token: ", cookie.getAll())
}