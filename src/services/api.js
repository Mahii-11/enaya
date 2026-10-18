import axios from "axios";
const BASE_URL = "https://dashboard.enayas.com/api/";


/* For all Get requests */

const fetchData = async (endpoint, option = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
            },
            ...option,
        });
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch Error:", error.message);
        throw error;
    }
}



// Get Sliders 
export const getSliders = async () => {
    const res = await fetchData("slider-data");
    if (!res.status || !Array.isArray(res.data)) {
        throw new Error("Slider fetch unsuccessful");
    }
    return res.data
        .filter((item) => item.status === 1)
        .sort((a, b) => a.serial - b.serial)
        .map((item) => ({
            id: item.id,
            mediaType: item.media_type === "video" ? "video" : "image",
            mediaUrl: item.media_type === "video" ? item.video : item.image,
            mobileUrl: item.mobile_image || null,
            altText: "Banner",
        }))
        .filter((item) => item.mediaUrl);
}


// Get Featured Categories
export const getFeaturedCategories = async () => {
    const res = await fetchData("featured-category-data");
    if (!res.status || !Array.isArray(res.data)) {
        throw new Error("Featured categories fetch unsuccessful");
    }
    return res.data
        .sort((a, b) => a.serial - b.serial)
        .map((item) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            image: item.image,
        }));
}


// Get Home Category Sections (category banner + products)
export const getHomeCategories = async () => {
    const res = await fetchData("home-category-data");
    if (!res.status || !Array.isArray(res.data)) {
        throw new Error("Home categories fetch unsuccessful");
    }
    return res.data
        .filter((item) => item.category && item.products?.length > 0)
        .sort((a, b) => (a.serial ?? Infinity) - (b.serial ?? Infinity));
}


// Get Watch & Shop products (YouTube video products)
export const getWatchShopProducts = async () => {
    const res = await fetchData("watch-shop-data");
    if (!res.status || !Array.isArray(res.data)) {
        throw new Error("Watch & Shop fetch unsuccessful");
    }
    return res.data.filter((item) => item.video_embed_url || item.video_url);
}


export const getTopMenuData = async ()  => {
  const res = await fetchData("top-menu-data");
  if (!res.success) {
    throw new Error("Top Menu Data fetch unsufessful");
  }
  return res.menu_data || [];
}

export const getsearchProducts = async (searchTerm) => {
  const res = await fetchData(`search-products?search=${searchTerm}`)

  if (!res) {
    throw new Error("Search product fetch unsuccessful");
  }

  return res?.data?.data || [];

};

export const getWhyShopWithUs = async () => {
    const res = await fetchData("why-shop-data");
    if (!res.success) {
        throw new Error("Why shop with us fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getOfferBanner = async () => {
    const res = await fetchData("offer-banner-data");
    if (!res.success) {
        throw new Error("Offer banner fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getPremimumCategories = async () => {
    const res = await fetchData("popular-category-data");
    if (!res.success) {
        throw new Error("Premium categories fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getProductsByEndpoint = async (endpoint) => {
    const res = await fetchData(endpoint);

    if (!res.success) {
        throw new Error(`${endpoint} fetch unsuccessful`);
    }

    return res?.data?.data || [];
};

export const getMostViewedProducts = async () => {
    const res = await fetchData("most-viewed-product-data");
    if (!res.success) {
        throw new Error("Most viewed products fetch unsuccessful");
    }
    return res?.data?.data || [];
}

export const getDealofDayProducts = async () => {
    const res = await fetchData("deal-of-the-day");
    if (!res.success) {
        throw new Error("Deal of the day products fetch unsuccessful")
    }
    return res?.data?.data || [];
}


export const getOnlineSaleProducts = async () => {
  const res = await fetchData("offer-products");
  if (!res.success) {
    throw new Error("Online Sale Products fetch unsuccessful")
  }
  return res?.data?.data || [];
}


export const getOurLocations = async () => {
  const res = await fetchData("our-store-data");
  if (!res.success) {
    throw new Error("Our location fetch unsuccessful");
  }
  return res?.data?.data || [];
}






export const getProductDetailsBySlugg = async (slug) => {
  const res = await fetchData(`product-details/${slug}`);
  if (!res.success) {
    throw new Error(`Product details fetch unsuccessful for slug: ${slug}`);
  }
  return res?.data?.product || null;
};



// Fetch product details by slug
export const getProductDetailsBySlug = async (slug) => {
  try {
    const res = await fetch(`${BASE_URL}product-details/${slug}`);
    
    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API did not return JSON. Check the endpoint or server error.");
    }

    const data = await res.json();

    if (!data.product) {
      throw new Error(`Product details fetch unsuccessful for slug: ${slug}`);
    }

    return data;

  } catch (error) {
    console.error("Error in getProductDetailsBySlug:", error);
    throw error;
  }
};

// Post Api

/*export async function createOrder(orderData) {
  try {
    console.log("Creating order with data:", orderData);

    const response = await fetch(`${BASE_URL}store-order`, {
      method: "POST",
      body: orderData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // read server error message
      throw new Error(`Server Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
} */


export async function createOrder(orderData) {
  try {
    const response = await fetch(`${BASE_URL}store-order`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: orderData,
    });

    console.log("STATUS:", response.status);

    const text = await response.text();
    console.log("SERVER RESPONSE:", text);

    if (!text) {
      return { success: false, msg: "Empty response from server" };
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}




// post api for login  / register



export const registerApi = async (data) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append("email", data.email.trim());
    formData.append("phone", data.phone.trim());
    formData.append("password", data.password);
    formData.append(
      "password_confirmation",
      data.password_confirmation
    );

    console.log("REGISTER PAYLOAD:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await axios.post(`${BASE_URL}register-api`, formData);

    return res.data;
  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data);
    return error.response?.data || {
      status: false,
      message: "Server Error",
    };
  }
};

export const loginApi = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());

    console.log("LOGIN PAYLOAD:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(
      `${BASE_URL}store-login-api`,
      {
        method: "POST",
        body: formData,
      }
    );

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    return JSON.parse(text);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    throw error;
  }
};

export const logoutApi = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}logout-api`,

  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
  }
  );

return await res.json();

};





// post api for upddating user profile


export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}get-profile-details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}update-user-profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const text = await res.text();
  console.log("RAW:", text);

  try {
    return JSON.parse(text);
  } catch {
    return { notification: text };
  }
};






// ✅ services/api.js

export const getUserOrders = async () => {
  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken");

    const response = await fetch(
      `${BASE_URL}get-all-orders`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("USER ORDERS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch orders");
    }

    return data;
  } catch (error) {
    console.error("getUserOrders Error:", error);
    throw error;
  }
};




export const getSingleOrder = async (id) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await axios.get(
      `${BASE_URL}order-details/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching single order:", error.response?.data || error);

    return { success: false };
  }
};