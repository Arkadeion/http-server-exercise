import { Static, Type } from "@sinclair/typebox";

export const commentSchema = Type.Object(
    {
        title: Type.String(),
        userId: Type.Integer(),
        commentBody: Type.String(),
    },
    { additionalProperties: false }
);

export type CommentData = Static<typeof commentSchema>;
