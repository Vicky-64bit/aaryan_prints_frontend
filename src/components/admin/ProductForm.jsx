import { useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductForm({ initial = {}, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: initial.name || "",
    description: initial.description || "",
    price: initial.price || 0,
    discountPrice: initial.discountPrice || 0,
    countInStock: initial.countInStock || 0,
    sku: initial.sku || "",
    category: initial.category || "Clothing",
    brand: initial.brand || "",
    sizes: initial.sizes || [],
    colors: initial.colors || [],
    collections: initial.collections || "",
    material: initial.material || "",
    gender: initial.gender || "Men",
    images: initial.images || [],
    isFeatured: initial.isFeatured || false,
    isPublished: initial.isPublished || false,
    tags: initial.tags || [],
    metaTitle: initial.metaTitle || "",
    metaDescription: initial.metaDescription || "",
    metaKeywords: initial.metaKeywords || "",
    dimensions: initial.dimensions || { length: 0, width: 0, height: 0 },
    weight: initial.weight || 0,
    flipkartUrl: initial.flipkartUrl || "",
  });

  const [sizesText, setSizesText] = useState((initial.sizes || []).join(","));
  const [colorsText, setColorsText] = useState(
    (initial.colors || []).join(","),
  );
  const [tagsText, setTagsText] = useState((initial.tags || []).join(","));
  const [imagesText, setImagesText] = useState(
    (initial.images || []).map((img) => img.url).join(","),
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [skuError, setSkuError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Check SKU uniqueness when SKU field changes
    // if (field === "sku") {
    //   checkSku(value);
    // }
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: Number(value) || 0,
      },
    }));
  };

  // const checkSku = async (sku) => {
  //   if (!sku) {
  //     setSkuError("");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${API_URL}/api/products/check-sku?sku=${encodeURIComponent(sku)}`
  //     );
  //     const data = await response.json();

  //     if (data.exists && (!initial.sku || initial.sku !== sku)) {
  //       setSkuError("SKU already exists");
  //     } else {
  //       setSkuError("");
  //     }
  //   } catch (error) {
  //     console.error("SKU check failed:", error);
  //   }
  // };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      // const userInfo = JSON.parse(localStorage.getItem("usertoken"));
      const token = localStorage.getItem("usertoken");

      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { imageUrl: text };
      }

      if (data.imageUrl) {
        const newImagesText = imagesText
          ? `${imagesText},${data.imageUrl}`
          : data.imageUrl;
        setImagesText(newImagesText);
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      } else {
        console.error("Unexpected upload response:", data);
        alert("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      handleImageUpload(file);
    }
    // Reset file input
    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.countInStock < 0)
      newErrors.countInStock = "Stock cannot be negative";
    if (!sizesText.trim()) newErrors.sizes = "At least one size is required";
    if (!colorsText.trim()) newErrors.colors = "At least one color is required";
    if (!imagesText.trim()) newErrors.images = "At least one image is required";
    if (skuError) newErrors.sku = skuError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    setSaving(true);
    try {
      // Process arrays from text inputs
      const sizes = sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const colors = colorsText
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const tags = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Process images - convert URLs to image objects
      const images = imagesText
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => ({
          url,
          altText: formData.name || "Product image",
        }));

      const productData = {
        ...formData,
        sizes,
        colors,
        tags,
        images,
        price: Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        countInStock: Number(formData.countInStock) || 0,
        weight: Number(formData.weight) || 0,
        dimensions: {
          length: Number(formData.dimensions.length) || 0,
          width: Number(formData.dimensions.width) || 0,
          height: Number(formData.dimensions.height) || 0,
        },
        flipkartUrl: String(formData.flipkartUrl) || null,
        // Ensure these are booleans
        isFeatured: Boolean(formData.isFeatured),
        isPublished: Boolean(formData.isPublished),
        // Add default values for rating and reviews
        rating: formData.rating || 0,
        numReviews: formData.numReviews || 0,
        // Add enabled field for compatibility
        enabled: formData.enabled !== undefined ? formData.enabled : true,
      };

      await onSave(productData);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    "Clothing",
    "T-Shirts",
    "Top Wear",
    "Pants",
    "Jeans",
    "Shorts",
    "Jackets",
    "Sweaters",
    "Dresses",
    "Skirts",
    "Activewear",
    "Accessories",
    "Shoes",
    "Bags",
    "Jewelry",
  ];

  const brands = [
    "Aaryan Prints",
    "Nike",
    "Adidas",
    "Zara",
    "H&M",
    "Levi's",
    "Puma",
    "Under Armour",
    "Tommy Hilfiger",
    "Calvin Klein",
  ];

  const collections = [
    "Summer Collection",
    "Winter Collection",
    "Spring Collection",
    "Fall Collection",
    "New Arrivals",
    "Best Sellers",
    "Limited Edition",
    "Sale",
  ];

  return (
    <div className="text-black max-h-[80vh] overflow-y-auto">
      <div className="space-y-6 p-1">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.sku ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.sku && (
              <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-3 text-lg font-semibold text-gray-900 mb-2">
            Pricing & Inventory
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              step="0.01"
              required
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Price (₹)
            </label>
            <input
              type="number"
              value={formData.discountPrice}
              onChange={(e) =>
                handleInputChange("discountPrice", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={(e) =>
                handleInputChange("countInStock", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.countInStock ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              required
            />
            {errors.countInStock && (
              <p className="text-red-500 text-xs mt-1">{errors.countInStock}</p>
            )}
          </div>
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
            Categorization
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g. T-Shirts, Jeans, Dresses"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection *
            </label>
            <select
              value={formData.collections}
              onChange={(e) => handleInputChange("collections", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
            Product Attributes
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes (comma separated) *
            </label>
            <input
              type="text"
              name="sizes"
              value={sizesText}
              onChange={(e) => setSizesText(e.target.value)}
              placeholder="S, M, L, XL"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.sizes ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.sizes && (
              <p className="text-red-500 text-xs mt-1">{errors.sizes}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colors (comma separated) *
            </label>
            <input
              type="text"
              name="colors"
              value={colorsText}
              onChange={(e) => setColorsText(e.target.value)}
              placeholder="Red, Blue, Green"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.colors ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.colors && (
              <p className="text-red-500 text-xs mt-1">{errors.colors}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => handleInputChange("material", e.target.value)}
              placeholder="Cotton, Polyester, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="summer, casual, new"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Images */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Product Images
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URLs (comma separated) *
              </label>
              <input
                type="text"
                name="images"
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.images ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.images && (
                <p className="text-red-500 text-xs mt-1">{errors.images}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Enter comma-separated URLs of product images
              </p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="text-blue-600 text-sm">Uploading...</div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload an image (JPG, PNG, GIF, max 5MB)
              </p>
            </div>

            {/* Preview uploaded images */}
            {imagesText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Previews
                </label>
                <div className="flex flex-wrap gap-2">
                  {imagesText.split(",").map(
                    (url, index) =>
                      url.trim() && (
                        <div key={index} className="relative">
                          <img
                            src={url.trim()}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Physical Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 mb-2">
            Physical Properties
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions (cm)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    handleDimensionChange("length", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    handleDimensionChange("width", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    handleDimensionChange("height", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO & Settings */}
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            SEO & Settings
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flipkart Product URL
            </label>
            <input
              type="url"
              value={formData.flipkartUrl}
              onChange={(e) => handleInputChange("flipkartUrl", e.target.value)}
              placeholder="https://www.flipkart.com/your-product-link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, customers can buy this product on Flipkart
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange("metaTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) =>
                handleInputChange("metaDescription", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.metaKeywords}
              onChange={(e) =>
                handleInputChange("metaKeywords", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  handleInputChange("isFeatured", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  handleInputChange("isPublished", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Published
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 justify-end border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(errors).length > 0 || skuError}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : initial.name ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </div>
  );
}
