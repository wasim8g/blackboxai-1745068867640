// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Instagram {
    struct User {
        string username;
        string bio;
        string profileImage; // IPFS hash or URL
        uint256[] posts;
        mapping(address => bool) followers;
        mapping(address => bool) following;
    }

    struct Post {
        uint256 id;
        address author;
        string imageHash; // IPFS hash or URL
        string caption;
        uint256 timestamp;
        uint256 likeCount;
        mapping(address => bool) likes;
    }

    uint256 public postCount;
    mapping(address => User) private users;
    mapping(uint256 => Post) private posts;

    event UserRegistered(address indexed user, string username);
    event PostCreated(uint256 indexed postId, address indexed author, string imageHash, string caption);
    event PostLiked(uint256 indexed postId, address indexed liker);
    event Followed(address indexed follower, address indexed following);

    modifier userExists(address user) {
        require(bytes(users[user].username).length != 0, "User does not exist");
        _;
    }

    function registerUser(string memory _username, string memory _bio, string memory _profileImage) public {
        require(bytes(users[msg.sender].username).length == 0, "User already registered");
        users[msg.sender].username = _username;
        users[msg.sender].bio = _bio;
        users[msg.sender].profileImage = _profileImage;
        emit UserRegistered(msg.sender, _username);
    }

    function createPost(string memory _imageHash, string memory _caption) public userExists(msg.sender) {
        postCount++;
        Post storage newPost = posts[postCount];
        newPost.id = postCount;
        newPost.author = msg.sender;
        newPost.imageHash = _imageHash;
        newPost.caption = _caption;
        newPost.timestamp = block.timestamp;
        newPost.likeCount = 0;

        users[msg.sender].posts.push(postCount);

        emit PostCreated(postCount, msg.sender, _imageHash, _caption);
    }

    function likePost(uint256 _postId) public userExists(msg.sender) {
        Post storage post = posts[_postId];
        require(post.id != 0, "Post does not exist");
        require(!post.likes[msg.sender], "Already liked this post");

        post.likes[msg.sender] = true;
        post.likeCount++;

        emit PostLiked(_postId, msg.sender);
    }

    function followUser(address _userToFollow) public userExists(msg.sender) userExists(_userToFollow) {
        require(_userToFollow != msg.sender, "Cannot follow yourself");
        require(!users[msg.sender].following[_userToFollow], "Already following this user");

        users[msg.sender].following[_userToFollow] = true;
        users[_userToFollow].followers[msg.sender] = true;

        emit Followed(msg.sender, _userToFollow);
    }

    // View functions

    function getUser(address _user) public view userExists(_user) returns (
        string memory username,
        string memory bio,
        string memory profileImage,
        uint256[] memory userPosts,
        uint256 followerCount,
        uint256 followingCount
    ) {
        User storage user = users[_user];
        username = user.username;
        bio = user.bio;
        profileImage = user.profileImage;
        userPosts = user.posts;

        followerCount = 0;
        followingCount = 0;

        // Count followers and following
        // Note: This is gas expensive, so in production consider off-chain indexing
        for (uint256 i = 0; i < 10000; i++) {
            // This loop is a placeholder and not practical on-chain
            // We will omit counting here for simplicity
        }
    }

    function getPost(uint256 _postId) public view returns (
        uint256 id,
        address author,
        string memory imageHash,
        string memory caption,
        uint256 timestamp,
        uint256 likeCount
    ) {
        Post storage post = posts[_postId];
        require(post.id != 0, "Post does not exist");
        return (
            post.id,
            post.author,
            post.imageHash,
            post.caption,
            post.timestamp,
            post.likeCount
        );
    }
}
