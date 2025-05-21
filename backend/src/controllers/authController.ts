import jwt from "jsonwebtoken";

export const getUserId = (auth: String) => {
    const token = auth?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return decoded.userId
}