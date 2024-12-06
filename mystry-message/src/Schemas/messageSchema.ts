import { z } from "zod";


export const messageSchema = z.object({
    content: z.string()
        .min(7, "Message must be at least 7 characters")
        .max(300, "Message must be at most 300 characters"),
})