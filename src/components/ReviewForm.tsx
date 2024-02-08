import React, {useState} from 'react';
import z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {insertReview} from "../services/reviews-service.ts";

const schema = z.object({
    comment: z.string({required_error: "must contains comment"}).max(500, "comment must be less then 500 charecters"),
})

type FormData = z.infer<typeof schema>

export interface ReviewProps {
    postId: string
}

function ReviewForm({postId}: ReviewProps) {
    const [comment, setComment] = useState("");
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({resolver: zodResolver(schema)})

    const onSubmit = async () => {
        await insertReview({comment, post: postId})
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3 col-md-7 mx-auto">
            <h1>Add Review</h1>
            <div className="mb-3 mt-3">
                <label htmlFor="comment">Comment</label>
                <input {...register("comment")} type="text" id="comment" className="form-control" value={comment}
                       onChange={(event) => setComment(event.target.value)}/>
                {errors.comment && <p className="text-danger">{errors.comment.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default ReviewForm;
