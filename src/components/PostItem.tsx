import {IUser} from "../services/user-service.ts";
import {UserDetailsData} from "../stateManagement/RecoilState.ts";
import avatar from "../assets/avatar.jpeg";
import {Card} from "react-bootstrap";


export interface PostItemData {
    _id: string
    city: string;
    street: string;
    streetNumber: number;
    description: string;
    imageUrl: string;
    pricePerDay: number;
    user: IUser & { userProfileDetails: UserDetailsData };
    reviewCounts: number
}

interface PostProps {
    post: PostItemData,
    onClickPostItem: (post: PostItemData) => void
}

function PostItem({post, onClickPostItem}: PostProps) {

    return (
        <Card onClick={() => onClickPostItem(post)}
              className={"post-item"} style={{width: '250px'}}>
            <Card.Img variant="top" src={post.imageUrl} alt={avatar}
                      className={"post-item-image"} style={{height: '150px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title>{post.user.userProfileDetails.name}</Card.Title>
                <Card.Text>
                    <strong>Price:</strong> ${post.pricePerDay}
                    <br/>
                    <strong>Location:</strong> {post.streetNumber} {post.street}, {post.city}
                    <br/>
                    <strong>Reviews:</strong> {post.reviewCounts}
                    <br/>
                    <strong>Description:</strong> {post.description}`
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default PostItem
