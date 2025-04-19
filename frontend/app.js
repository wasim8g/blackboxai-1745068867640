const contractAddress = ""; // To be updated after deployment
const contractABI = [
  // ABI will be generated after contract compilation, placeholder for now
];

let provider;
let signer;
let contract;
let currentAccount;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = await signer.getAddress();
  document.getElementById("connectWalletBtn").innerText = "Wallet Connected";
  document.getElementById("connectWalletBtn").disabled = true;

  contract = new ethers.Contract(contractAddress, contractABI, signer);

  await loadUserProfile();
  await loadPosts();

  document.getElementById("userProfile").classList.remove("hidden");
  document.getElementById("createPostSection").classList.remove("hidden");
}

async function loadUserProfile() {
  try {
    const user = await contract.getUser(currentAccount);
    document.getElementById("username").innerText = user[0];
    document.getElementById("bio").innerText = user[1];
    document.getElementById("profileImage").src = user[2] || "https://via.placeholder.com/64";
  } catch (error) {
    console.error("User not registered or error:", error);
  }
}

async function loadPosts() {
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  try {
    const postCount = await contract.postCount();
    for (let i = postCount; i >= 1; i--) {
      const post = await contract.getPost(i);
      const postElement = document.createElement("div");
      postElement.className = "bg-white p-4 rounded shadow";

      postElement.innerHTML = `
        <div class="flex items-center space-x-4 mb-2">
          <img src="https://via.placeholder.com/40" alt="Author" class="w-10 h-10 rounded-full object-cover" />
          <span class="font-semibold">${post[1]}</span>
        </div>
        <img src="https://ipfs.io/ipfs/${post[2]}" alt="Post Image" class="w-full rounded mb-2" />
        <p class="mb-2">${post[3]}</p>
        <div class="flex items-center space-x-4">
          <button class="likeBtn text-red-500 hover:text-red-700" data-postid="${post[0]}">
            <i class="fas fa-heart"></i> ${post[5]}
          </button>
        </div>
      `;

      postsContainer.appendChild(postElement);
    }

    // Add event listeners for like buttons
    document.querySelectorAll(".likeBtn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const postId = e.currentTarget.getAttribute("data-postid");
        try {
          const tx = await contract.likePost(postId);
          await tx.wait();
          alert("Post liked!");
          await loadPosts();
        } catch (error) {
          console.error("Error liking post:", error);
          alert("Error liking post");
        }
      });
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

async function createPost() {
  const imageHash = document.getElementById("imageHashInput").value.trim();
  const caption = document.getElementById("captionInput").value.trim();

  if (!imageHash) {
    alert("Please enter an image IPFS hash or URL");
    return;
  }

  try {
    const tx = await contract.createPost(imageHash, caption);
    await tx.wait();
    alert("Post created!");
    document.getElementById("imageHashInput").value = "";
    document.getElementById("captionInput").value = "";
    await loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Error creating post");
  }
}

document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("createPostBtn").addEventListener("click", createPost);
