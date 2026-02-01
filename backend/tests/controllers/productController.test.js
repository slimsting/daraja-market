import {
  createProduct,
  getAllProducts,
  getAllMyProducts,
  getProductByID,
  updateProductById,
  deleteProductById,
} from "../../src/controllers/productController.js";
import Product from "../../src/models/productModel.js";
import { successResponse } from "../../src/utils/responseHandler.js";
import { pickAllowedFields } from "../../src/middleware/utils/utils.js";

// Mock the dependencies
jest.mock("../../src/models/productModel.js");
jest.mock("../../src/utils/responseHandler.js");
jest.mock("../../src/middleware/utils/utils.js");

const mockRequest = (body = {}, user = {}, params = {}) => ({
  body,
  user,
  params,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("createProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product successfully", async () => {
    const req = mockRequest(
      {
        name: "Apples",
        category: "fruits",
        price: 100,
        unit: "kg",
        quantity: 50,
      },
      { id: "userId" },
    );
    const res = mockResponse();

    const mockProduct = {
      _id: "productId",
      name: "Apples",
      farmer: "userId",
      save: jest.fn().mockResolvedValue(),
    };

    Product.mockImplementation(() => mockProduct);
    successResponse.mockReturnValue();

    await createProduct(req, res);

    expect(Product).toHaveBeenCalledWith({
      name: "Apples",
      category: "fruits",
      price: 100,
      unit: "kg",
      quantity: 50,
      farmer: "userId",
    });
    expect(mockProduct.save).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      res,
      expect.any(Object),
      "Product created successfully",
      201,
    );
  });

  it("should throw error if user not authenticated", async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    await expect(createProduct(req, res)).rejects.toThrow(
      "Unauthorized. Please login first",
    );
  });
});

describe("getAllProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all products", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const mockProducts = [{ name: "Apples" }];
    Product.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockProducts),
        }),
      }),
    });
    successResponse.mockReturnValue();

    await getAllProducts(req, res);

    expect(Product.find).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      res,
      mockProducts,
      "Successfully retrieved products",
    );
  });
});

describe("getAllMyProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return farmer products", async () => {
    const req = mockRequest({}, { role: "farmer", id: "userId" });
    const res = mockResponse();

    const mockProducts = [{ name: "Apples" }];
    Product.find = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockProducts),
        }),
      }),
    });
    successResponse.mockReturnValue();

    await getAllMyProducts(req, res);

    expect(Product.find).toHaveBeenCalledWith({ farmer: "userId" });
    expect(successResponse).toHaveBeenCalledWith(
      res,
      mockProducts,
      "Successfully retrieved farmer products",
    );
  });

  it("should throw error if not farmer", async () => {
    const req = mockRequest({}, { role: "admin" });
    const res = mockResponse();

    await expect(getAllMyProducts(req, res)).rejects.toThrow(
      "Access denied. Insufficient permissions",
    );
  });
});

describe("getProductByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return product by ID", async () => {
    const req = mockRequest({}, {}, { productId: "123" });
    const res = mockResponse();

    const mockProduct = { name: "Apples" };
    Product.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockProduct),
        }),
      }),
    });
    successResponse.mockReturnValue();

    await getProductByID(req, res);

    expect(Product.findById).toHaveBeenCalledWith("123");
    expect(successResponse).toHaveBeenCalledWith(
      res,
      mockProduct,
      "Successfully retrieved product",
    );
  });

  it("should throw error if product not found", async () => {
    const req = mockRequest({}, {}, { productId: "123" });
    const res = mockResponse();

    Product.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      }),
    });

    await expect(getProductByID(req, res)).rejects.toThrow("Product not found");
  });
});

describe("updateProductById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update product successfully", async () => {
    const req = mockRequest(
      { name: "Updated Apples" },
      { role: "farmer", id: "userId" },
      { productId: "123" },
    );
    const res = mockResponse();

    const mockProduct = {
      farmer: "userId",
      save: jest.fn().mockResolvedValue(),
    };
    Product.findById = jest.fn().mockResolvedValue(mockProduct);
    pickAllowedFields.mockReturnValue({ name: "Updated Apples" });
    successResponse.mockReturnValue();

    await updateProductById(req, res);

    expect(pickAllowedFields).toHaveBeenCalledWith({ name: "Updated Apples" }, [
      "name",
      "category",
      "description",
      "price",
      "unit",
      "quantity",
      "images",
      "available",
      "harvestDate",
      "organic",
      "tags",
    ]);
    expect(mockProduct.save).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      res,
      mockProduct,
      "Product updated successfully",
    );
  });

  it("should throw error if not owner", async () => {
    const req = mockRequest(
      {},
      { role: "farmer", id: "userId" },
      { productId: "123" },
    );
    const res = mockResponse();

    const mockProduct = { farmer: "otherId" };
    Product.findById = jest.fn().mockResolvedValue(mockProduct);

    await expect(updateProductById(req, res)).rejects.toThrow(
      "Access denied. You do not own this product",
    );
  });
});

describe("deleteProductById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete product successfully", async () => {
    const req = mockRequest(
      {},
      { role: "farmer", id: "userId" },
      { productId: "123" },
    );
    const res = mockResponse();

    const mockProduct = {
      farmer: "userId",
      deleteOne: jest.fn().mockResolvedValue(),
    };
    Product.findById = jest.fn().mockResolvedValue(mockProduct);
    successResponse.mockReturnValue();

    await deleteProductById(req, res);

    expect(mockProduct.deleteOne).toHaveBeenCalled();
    expect(successResponse).toHaveBeenCalledWith(
      res,
      { _id: "123" },
      "Product deleted successfully",
    );
  });

  it("should throw error if broker tries to delete", async () => {
    const req = mockRequest({}, { role: "broker" }, { productId: "123" });
    const res = mockResponse();

    const mockProduct = { farmer: "userId" };
    Product.findById = jest.fn().mockResolvedValue(mockProduct);

    await expect(deleteProductById(req, res)).rejects.toThrow(
      "Brokers are not allowed to delete products",
    );
  });
});
