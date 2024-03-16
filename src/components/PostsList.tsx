import {useEffect, useState} from "react"
import PostItem, {PostItemData} from "./PostItem.tsx"
import {useRecoilState} from "recoil";
import {fullPostsState} from "../stateManagement/RecoilState.ts";
import {getAllFullPosts} from "../services/posts-service.ts";
import {Col, Container, Row} from "react-bootstrap";
import '../css/PostsList.css';
import PostDisplayDialog from "./PostDisplayDialog.tsx";
import AddReviewDialog from "./AddReviewDialog.tsx";
import PostForm from "./PostForm.tsx";


interface PostData {
    title: string;
    message: string;
    owner: string;
}

interface PostListProps {
    filterByUserId?: string
}

function PostsList(props: PostListProps) {
    const [posts, setPosts] = useRecoilState<PostItemData[]>(fullPostsState);

    const [showPostItemDialog, setShowPostItemDialog] = useState(false);
    const [showAddReviewDialog, setShowAddReviewDialog] = useState(false);
    const [showPostFormForEdit, setShowPostFormForEdit] = useState(false);
    const [postForDisplay, setPostForDisplay] = useState<PostItemData>()
    const [postList, setPostList] = useState(posts);
    const [loading, setLoading] = useState<boolean>(false);


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
        return postList.map((post) => (
            <Col key={post._id}>
                <PostItem key={post._id} post={post} onClickPostItem={onClickPostItem}/>
            </Col>
        ))
    }

    useEffect(() => {
        setLoading(true);
        console.log("setPostList")
        console.log("posts from recoil:", posts)
          setPostList(props.filterByUserId ? posts.filter(value => value.user._id === props.filterByUserId) : posts);
        postForDisplay && setPostForDisplay(posts.find(value => value._id === postForDisplay?._id))
        // setLoading(false)
    }, [posts]);


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



    return (
        <div>
            <div style={{position:"fixed", zIndex:"1", top: "50%", left: "50%", transform: 'translate(-50%, -50%)'}}>
                {loading && (
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                )}
                {/*<Button onClick={fetchData} disabled={loading}>*/}
                {/*    {loading ? 'Loading...' : 'Fetch Data'}*/}
                {/*</Button>*/}
            </div>
            {/*<NavBar/>*/}
            {!showPostFormForEdit && <div className="background overflow-y-auto" style={{height: "84vh"}}>
                <Container style={{marginBottom:"4rem"}}>
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
