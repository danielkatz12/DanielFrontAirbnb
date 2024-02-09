import {useEffect} from "react"
import PostItem from "./PostItem.tsx"
import {useRecoilState} from "recoil";
import {currentDisplayedComponentState, fullPostsState} from "../stateManagement/RecoilState.ts";
import {getAllFullPosts} from "../services/posts-service.ts";
import {Col, Container, Row} from "react-bootstrap";
import '../css/PostsList.css';


interface PostData {
    title: string;
    message: string;
    owner: string;
}

function PostsList() {
    const [posts, setPosts] = useRecoilState(fullPostsState);
    const [currDisplayedComp, setCurrDisplayedComp] = useRecoilState(currentDisplayedComponentState);


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
        <div className="background">
            <Container>
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {posts.map((post) => (
                        <Col key={post._id}>
                            <PostItem key={post._id} post={post}/>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default PostsList
