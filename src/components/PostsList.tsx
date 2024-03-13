import {useEffect, useState} from "react"
import PostItem, {PostItemData} from "./PostItem.tsx"
import {useRecoilState} from "recoil";
import {currentDisplayedComponentState, fullPostsState} from "../stateManagement/RecoilState.ts";
import {getAllFullPosts} from "../services/posts-service.ts";
import {Button, Col, Container, Row} from "react-bootstrap";
import '../css/PostsList.css';
import PostDisplayDialog from "./PostDisplayDialog.tsx";
import AddReviewDialog from "./AddReviewDialog.tsx";
import PostForm from "./PostForm.tsx";
import {PostDto} from "../dtos/post-dto.ts";
import axios, {AxiosError} from "axios";
import {useRefreshToken, Tokens} from "../services/user-service.ts";
import {getRefreshTokenFromLocalStorage} from "../services/token-service.ts";
import apiClient from "../services/api-client.ts";


interface PostData {
    title: string;
    message: string;
    owner: string;
}

interface PostListProps {
    filterByUserId?: string
}

function PostsList(props: PostListProps) {
    const [posts, setPosts] = useRecoilState(fullPostsState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);

    const [showPostItemDialog, setShowPostItemDialog] = useState(false);
    const [showAddReviewDialog, setShowAddReviewDialog] = useState(false);
    const [showPostFormForEdit, setShowPostFormForEdit] = useState(false);
    const [postForDisplay, setPostForDisplay] = useState<PostItemData>()

    const onClickPostItem = (post: PostItemData) => {
        setShowAddReviewDialog(false);
        setShowPostItemDialog(true);
        setPostForDisplay(post);
    };

    const onClickAddReviewButton = () => {
        setShowPostItemDialog(false);
        setShowAddReviewDialog(true);
    };

    const onCloseAddReviewDialog = () => {
        setShowAddReviewDialog(false);
        setShowPostItemDialog(true);
    };

    const handleClosePostDialog = () => {
        setShowPostItemDialog(false);
    }

    const handleOpenPostForm = () => {
        setShowPostFormForEdit(true);
        handleClosePostDialog();
    }

    const handleClosePostForm = () => {
        console.log("handleClosePostForm")
        setShowPostFormForEdit(false);
        setShowPostItemDialog(true);
    }

    const filteredPostList = () => {
        const postList = props.filterByUserId ? posts.filter(value => value.user._id === props.filterByUserId) : posts;
        return postList.map((post) => (
            <Col key={post._id}>
                <PostItem key={post._id} post={post} onClickPostItem={onClickPostItem}/>
            </Col>
        ))
    }


    useEffect(() => {
        console.log("getAllPost request")
        getAllFullPosts().req.then(res => {
            console.log("Update posts list")
            console.log(res.data);
            setPosts(res.data);
        }).catch((error) => {
            console.log("there was a problem to get  posts list from server...")
        })
        return () => {
            console.log("clean up")
        }
    }, [])

    //const [token, setToken] = useState<string | null>(getRefreshTokenFromLocalStorage);
    //const [refreshPromise, setRefreshPromise] = useState<Promise<Tokens> | null>(null);
    // useEffect(() => {
    //     const interceptResponse = apiClient.interceptors.response.use(
    //         response => response,
    //         async (error: AxiosError) => {
    //             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //                 // If there's an ongoing refresh promise, return it
    //                 if (refreshPromise) {
    //                     return refreshPromise.then(() => apiClient.request(error.config));
    //                 }
    //                 // Otherwise, start a new refresh operation
    //                 const newRefreshPromise = refreshToken().then(newToken => {
    //                     //setToken(newToken.refreshToken);
    //                     setRefreshPromise(null); // Clear the refresh promise once refresh is done
    //                     return newToken;
    //                 }).catch(refreshError => {
    //                     setRefreshPromise(null); // Clear the refresh promise on refresh error
    //                     throw refreshError;
    //                 });
    //                 setRefreshPromise(newRefreshPromise);
    //                 return newRefreshPromise.then(() => axios.request(error.config));
    //             }
    //             return Promise.reject(error);
    //         }
    //     );
    //
    //     return () => {
    //         // Clean up interceptor on component unmount
    //         axios.interceptors.response.eject(interceptResponse);
    //     };
    // }, [token, refreshPromise]);
    const [refreshingToken, setRefreshingToken] = useState(false);
    const [failedRequests, setFailedRequests] = useState<any[]>([]);


    return (
        <div>
            {/*<NavBar/>*/}
            {!showPostFormForEdit && <div className="background overflow-y-scroll">
                <Container>
                    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                        {filteredPostList()}
                    </Row>
                </Container>
            </div>}
            <div>
                {showPostItemDialog && <PostDisplayDialog post={postForDisplay!} onAddReview={onClickAddReviewButton}
                                                          onClosePostDialog={handleClosePostDialog}
                                                          onEditPost={handleOpenPostForm}/>}
                {showAddReviewDialog &&
                    <AddReviewDialog onBackToPostDialog={onCloseAddReviewDialog} postId={postForDisplay!._id}/>}
                {showPostFormForEdit && postForDisplay && <PostForm onClosePostForm={handleClosePostForm}
                    postToEdit={{
                    _id: postForDisplay._id,
                    street: postForDisplay.street,
                    imageUrl: postForDisplay.imageUrl,
                    city: postForDisplay.city,
                    description: postForDisplay.description,
                    pricePerDay: postForDisplay.pricePerDay,
                    streetNumber: postForDisplay.streetNumber
                }}/>}
            </div>
        </div>
    )
}

export default PostsList
