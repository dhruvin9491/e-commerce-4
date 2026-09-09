export const CONFIRM_TEXT = {
    signOut: {
        admin: {
            title: "Sign out of the admin area?",
            text: "Your current session will be closed."
        },
        store: {
            title: "Sign out of shoplane?",
            text: "You can sign back in whenever you are ready."
        },
        button: "Yes, sign out"
    },
    product: {
        create: {
            title: "Create this product?",
            text: "The product will be added as inactive until you activate it.",
            button: "Yes, create product"
        },
        update: {
            title: "Update this product?",
            text: "The latest product details will replace the current ones.",
            button: "Yes, update product"
        },
        activate: {
            title: "Activate this product?",
            text: "The product will be visible in the store.",
            button: "Yes, activate"
        },
        deactivate: {
            title: "Deactivate this product?",
            text: "The product will no longer be visible in the store.",
            button: "Yes, deactivate"
        },
        recover: {
            title: "Recover this product?",
            text: "The product will be available in the catalog again.",
            button: "Yes, recover it"
        },
        delete: {
            title: "Delete this product?",
            text: "The product will be removed from the catalog.",
            button: "Yes, delete it"
        }
    },
    user: {
        restore: {
            title: "Restore this user?",
            text: "This user will be able to access the application again.",
            button: "Yes, restore"
        },
        deactivate: {
            title: "Deactivate this user?",
            text: "This user will no longer be able to access the application.",
            button: "Yes, deactivate"
        }
    }
};

export const TOAST_TEXT = {
    auth: {
        invalidCredentials: "Invalid email or password",
        inactiveAccount: "Your account is inactive. Contact an administrator.",
        loginSuccess: "Login successful",
        duplicateAccount: "An account with this email already exists",
        registrationSuccess: "Registration successful"
    },
    product: {
        updateSuccess: "Product updated successfully",
        createSuccess: "Product listed successfully.",
        updateError: "Failed to update product",
        statusError: "Failed to update product status",
        deletedSuccess: "Product deleted successfully",
        recoveredSuccess: "Product recovered successfully"
    },
    user: {
        restored: "User restored",
        deactivated: "User deactivated"
    }
};

export const PRODUCT_TEXT = {
    list: {
        eyebrow: "Catalog",
        title: "Products",
        shown: "shown",
        searchPlaceholder: "Search by title...",
        reset: "Reset",
        add: "Add product",
        image: "Image",
        titleColumn: "Title",
        stock: "Stock",
        price: "Price",
        action: "Action",
        archived: "Archived",
        visible: "Visible in store",
        hidden: "Hidden from store",
        loading: "Loading products",
        error: "We could not load products"
    },
    form: {
        eyebrow: "Catalog management",
        createTitle: "Add a product",
        updateTitle: "Refine a product",
        createDescription: "Give your next catalog item a clear, considered home.",
        updateDescription: "Keep the catalog details accurate and useful.",
        editing: "Editing",
        newListing: "New listing",
        basics: "01 / Basics",
        basicsTitle: "What are you offering?",
        inventory: "02 / Inventory",
        inventoryTitle: "Keep the numbers clear.",
        presentation: "03 / Presentation",
        presentationTitle: "Give it a strong first impression.",
        titleLabel: "Product title",
        titlePlaceholder: "e.g. Daily ritual cleanser",
        stockLabel: "Stock quantity",
        priceLabel: "Price (₹)",
        imageLabel: "Product image URL",
        imagePlaceholder: "https://...",
        updateButton: "Update product",
        createButton: "Create product",
        preview: "Live preview",
        category: "Featured product",
        previewTitle: "Your product title",
        loading: "Loading product"
    }
};

export const STORE_TEXT = {
    list: {
        eyebrow: "The collection",
        title: "Good things,",
        titleAccent: "well chosen.",
        pieces: "pieces ready to explore.",
        searchPlaceholder: "Search products",
        loading: "Loading products",
        error: "We could not load the store",
        emptyTitle: "Nothing matches that search",
        emptyMessage: "Try a different product name or clear the search."
    },
    detail: {
        loading: "Loading product",
        category: "Shoplane collection",
        description: "A considered everyday essential, selected for its simple utility and easy place in your routine.",
        availability: "Availability",
        inStock: "In stock",
        outOfStock: "Out of stock",
        quantity: "Quantity available",
        continue: "Continue browsing",
        unavailable: "Product unavailable",
        back: "Back to store"
    }
};

export const COMMON_TEXT = {
    cancel: "Cancel",
    confirm: "Yes, continue",
    signOut: "Sign out",
    products: "Products",
    featuredProduct: "Featured product",
    loadingUsers: "Loading users...",
    loading: "Loading",
    success: "Success",
    storeUpdate: "Store update"
};
