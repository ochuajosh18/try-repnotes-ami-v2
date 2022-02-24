import {
  DELETE_PRODUCT,
  Media,
  OptionalMachineFeature,
  ProductAction,
  ProductDetails,
  ProductInput,
  ProductValidation,
  SetProductSelectedCompanyFilter,
  SET_PRODUCT_STATE,
  StandardMachineFeature,
} from "./types";
import { ALERT_STATE } from "../../alert/types";
import { SET_REDIRECT, SystemState } from "../../system/types";
import { AppState, AppThunk } from "../../index";
import axios from "axios";
import filter from "lodash/filter";
import { v4 as uuidv4 } from "uuid";
import { uploadMedia } from "../../../util/upload";
const API_URL = process.env.REACT_APP_API_URL;

export const setProductState = (data: ProductInput): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: data,
});

export const setProductCompanyFilter = (data: SetProductSelectedCompanyFilter): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: data,
});

export const saveStandardMachineFeature = (
  product: ProductDetails,
  standardMachineFeature: StandardMachineFeature
): AppThunk => {
  return async (dispatch) => {
    if (standardMachineFeature.id === "") {
      if (
        product.standardMachineFeature.some((item) => item.name === standardMachineFeature.name)
      ) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Data already exist",
            alertType: "error",
          },
        });
      } else {
        let feature = standardMachineFeature;
        feature.id = uuidv4();
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            product: {
              ...product,
              standardMachineFeature: [...product.standardMachineFeature, feature],
            },
          },
        });
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            standardMachineFeature: {
              id: "",
              name: "",
              image: {
                name: "",
                path: "",
                size: 0,
                type: "",
              },
              subFeature: [],
            },
          },
        });
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: { dialogOpen: false, dialogOption: "" },
        });
      }
    } else {
      let index = product.standardMachineFeature
        .map((feature) => {
          return feature.id;
        })
        .indexOf(standardMachineFeature.id);
      product.standardMachineFeature[index] = standardMachineFeature;
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: {
          product: {
            ...product,
            standardMachineFeature: product.standardMachineFeature,
          },
        },
      });
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: {
          standardMachineFeature: {
            id: "",
            name: "",
            image: {
              name: "",
              path: "",
              size: 0,
              type: "",
            },
            subFeature: [],
          },
        },
      });
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { dialogOpen: false, dialogOption: "" },
      });
    }
  };
};

export const saveOptionalMachineFeature = (
  product: ProductDetails,
  optionalMachineFeature: OptionalMachineFeature
): AppThunk => {
  return async (dispatch) => {
    if (optionalMachineFeature.id === "") {
      if (
        product.optionalMachineFeature.some((item) => item.name === optionalMachineFeature.name)
      ) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Data already exist",
            alertType: "error",
          },
        });
      } else {
        let feature = optionalMachineFeature;
        feature.id = uuidv4();
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            product: {
              ...product,
              optionalMachineFeature: [...product.optionalMachineFeature, optionalMachineFeature],
            },
          },
        });
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            optionalMachineFeature: {
              id: "",
              name: "",
              image: {
                name: "",
                path: "",
                size: 0,
                type: "",
              },
              subFeature: [],
            },
          },
        });
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: { dialogOpen: false, dialogOption: "" },
        });
      }
    } else {
      let index = product.optionalMachineFeature
        .map((feature) => {
          return feature.id;
        })
        .indexOf(optionalMachineFeature.id);
      product.optionalMachineFeature[index] = optionalMachineFeature;
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: {
          product: {
            ...product,
            optionalMachineFeature: product.optionalMachineFeature,
          },
        },
      });
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: {
          optionalMachineFeature: {
            id: "",
            name: "",
            image: {
              name: "",
              path: "",
              size: 0,
              type: "",
            },
            subFeature: [],
          },
        },
      });
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { dialogOpen: false, dialogOption: "" },
      });
    }
  };
};

export const deleteStandardFeature = (product: ProductDetails, name: string): AppThunk => {
  return async (dispatch) => {
    let index = product.standardMachineFeature
      .map((feature) => {
        return feature.name;
      })
      .indexOf(name);
    product.standardMachineFeature.splice(index, 1);
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: {
        product: {
          ...product,
          standardMachineFeature: product.standardMachineFeature,
        },
      },
    });
  };
};

export const deleteOptionalFeature = (product: ProductDetails, id: string): AppThunk => {
  return async (dispatch) => {
    let index = product.optionalMachineFeature
      .map((feature) => {
        return feature.id;
      })
      .indexOf(id);
    product.optionalMachineFeature.splice(index, 1);
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: {
        product: {
          ...product,
          optionalMachineFeature: product.optionalMachineFeature,
        },
      },
    });
  };
};

export const clearProductDialog = (): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: { dialogOpen: false, dialogOption: "" },
});

export const setProductDialogOpen = (option: string): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: { dialogOpen: true, dialogOption: option },
});

export const setProductValidationState = (data: ProductValidation): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: data,
    });
    dispatch({
      type: ALERT_STATE,
      payload: {
        alertOpen: true,
        alertMessage: "Please Check Required Field",
        alertType: "error",
      },
    });
  };
};

export const loadFeatureDetails = (id: string, product: ProductDetails, type: string): AppThunk => {
  return async (dispatch) => {
    let index =
      type === "standard"
        ? product.standardMachineFeature
            .map((feature) => {
              return feature.id;
            })
            .indexOf(id)
        : product.optionalMachineFeature
            .map((feature) => {
              return feature.id;
            })
            .indexOf(id);
    let newFeature =
      type === "standard"
        ? product.standardMachineFeature[index]
        : product.optionalMachineFeature[index];
    if (type === "standard") {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { standardMachineFeature: newFeature },
      });
    } else {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { optionalMachineFeature: newFeature },
      });
    }
  };
};

export const getProductList = (system: SystemState, companyId?: string): AppThunk => {
  return async (dispatch) => {
    const { token } = system.session;
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true, productList: [] },
    });
    try {
      const payloadResult = await axios.get(
        `${API_URL}product?companyId=${
          companyId ? companyId : system.session.userDetails.companyId
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: { productList: [...payloadResult.data] },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const deleteProductImage = (
  product: ProductDetails | undefined,
  name?: string
): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: {
    product: {
      ...product,
      image: filter(product?.image, function (item) {
        return item.name !== name;
      }),
    },
  },
});

export const deleteProductVideo = (
  product: ProductDetails | undefined,
  name?: string
): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: {
    product: {
      ...product,
      video: filter(product?.video, function (item) {
        return item.name !== name;
      }),
    },
  },
});

export const deleteStandardFeatureImage = (
  standardMachineFeature: StandardMachineFeature
): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: {
    standardMachineFeature: {
      ...standardMachineFeature,
      image: { name: "", path: "", size: 0, type: "" },
    },
  },
});

export const deleteOptionalFeatureImage = (
  optionalMachineFeature: OptionalMachineFeature
): ProductAction => ({
  type: SET_PRODUCT_STATE,
  payload: {
    optionalMachineFeature: {
      ...optionalMachineFeature,
      image: { name: "", path: "", size: 0, type: "" },
    },
  },
});

export const loadProductDetails = (id: string, token?: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true },
    });
    try {
      const payloadResult = await axios.get(`${API_URL}product?id=${id}`);
      // to use, data is returned as payloadResult
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: { product: payloadResult.data },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveProductWithAddedFields = (formData: any, companyId: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true },
    });
    try {
      let data = { ...formData };
      delete data.id;
      data.companyId = companyId;
      data.price = parseInt(data.price as string);

      const featureKeys = ["standardMachineFeature", "optionalMachineFeature"];

      //console.log(data);
      for (const key of Object.keys(data)) {
        // if a `feature` property, get the image then upload
        if (featureKeys.includes(key)) {
          for (const featureItem in data[key]) {
            // get the image
            const fmedia = data[key][featureItem].image as Media;
            // upload if not falsy
            if (fmedia && fmedia.file) {
              const uploaded = await uploadMedia([fmedia.file], "product");
              data[key].splice(featureItem, 1, {
                ...data[key][featureItem],
                image: Array.isArray(uploaded) ? uploaded[0] : uploaded,
              });
            }
          }
        }

        // if the key is an array and
        // each item has a `file` & `name` properties, that's a media
        if (
          Array.isArray(data[key]) &&
          Array.from(data[key] as Media[]).every((e) => e.file && e.name)
        ) {
          let filesToUpload: Array<File> = [];
          for (const med in data[key]) {
            const me = data[key][med] as Media;
            if (me && me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          data = {
            ...data,
            [key]: [
              ...filter(data[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "product")),
            ],
          };
        }
      }

      const payloadResult = await axios.post(`${API_URL}product`, data);

      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Saved",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/product" },
        });
      }
    } catch (err: any) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateProductWithAddedFields = (formData: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true },
    });
    let data = { ...formData };
    data.price = parseInt(data.price as string);
    try {
      const featureKeys = ["standardMachineFeature", "optionalMachineFeature"];
      for (const key of Object.keys(data)) {
        // if a `feature` property, get the image then upload
        if (featureKeys.includes(key)) {
          for (const featureItem in data[key]) {
            // get the image
            const fmedia = data[key][featureItem].image as Media;
            // upload if not falsy
            if (fmedia && fmedia.file) {
              const uploaded = await uploadMedia([fmedia.file], "product");
              data[key].splice(featureItem, 1, {
                ...data[key][featureItem],
                image: Array.isArray(uploaded) ? uploaded[0] : uploaded,
              });
            }
          }
        }

        // if the key is an array and
        // each item has a `file` & `name` properties, that's a media
        if (
          Array.isArray(data[key]) &&
          Array.from(data[key] as Media[]).every((e) => e.file && e.name)
        ) {
          let filesToUpload: Array<File> = [];
          for (const med in data[key]) {
            const me = data[key][med] as Media;
            if (me && me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          data = {
            ...data,
            [key]: [
              ...filter(data[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "product")),
            ],
          };
        }
      }

      const payloadResult = await axios.put(`${API_URL}product/${data.id}`, data);

      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Updated",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/product" },
        });
      }
    } catch (err: any) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      } else console.log(err);
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const saveProduct = (
  data: ProductDetails | any,
  system: SystemState,
  companyId: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true },
    });
    try {
      delete data.id;
      data.companyId = companyId;
      data.price = parseInt(data.price as string);

      for (const key of Object.keys(data)) {
        if (["standardMachineFeature", "optionalMachineFeature"].includes(key)) {
          // single file upload
          for (const fi in data[key]) {
            const me = data[key][fi].image as Media;
            if (me && me.file) {
              const uploaded = await uploadMedia([me.file], "product");
              data[key].splice(fi, 1, {
                ...data[key][fi],
                image: Array.isArray(uploaded) ? uploaded[0] : uploaded,
              });
            }
          }
        }
        if (["video", "image"].includes(key)) {
          let filesToUpload: Array<File> = [];
          for (const m in data[key]) {
            const me = data[key][m] as Media;
            if (me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          data = {
            ...data,
            [key]: [
              ...filter(data[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "product")),
            ],
          };
        }
      }

      const payloadResult = await axios.post(`${API_URL}product`, data);

      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Saved",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/product" },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      }
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const updateProduct = (data: ProductDetails | any, system: SystemState): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { loading: true },
    });
    data.price = parseInt(data.price as string);
    try {
      const {
        modelName,
        categoryId,
        productFamilyId,
        description,
        keyFeatures,
        makeId,
        price,
        image,
        video,
        standardMachineFeature,
        optionalMachineFeature,
        isActive,
        companyId,
      } = data;
      let updateData: typeof data = {
        modelName,
        categoryId,
        productFamilyId,
        description,
        keyFeatures,
        makeId,
        price,
        image,
        video,
        standardMachineFeature,
        optionalMachineFeature,
        isActive,
        companyId,
      };

      for (const key of Object.keys(updateData)) {
        if (["standardMachineFeature", "optionalMachineFeature"].includes(key)) {
          // single file upload
          for (const fi in updateData[key]) {
            const me = updateData[key][fi].image as Media;
            if (me && me.file) {
              const uploaded = await uploadMedia([me.file], "product");
              updateData[key].splice(fi, 1, {
                ...updateData[key][fi],
                image: Array.isArray(uploaded) ? uploaded[0] : uploaded,
              });
            }
          }
        }
        if (["video", "image"].includes(key)) {
          let filesToUpload: Array<File> = [];
          for (const m in updateData[key]) {
            const me = updateData[key][m] as Media;
            if (me.file) {
              filesToUpload = [...filesToUpload, me.file];
            }
          }

          updateData = {
            ...updateData,
            [key]: [
              ...filter(updateData[key] as Array<Media>, (u) => !u.file),
              ...(await uploadMedia(filesToUpload, "product")),
            ],
          };
        }
      }

      const payloadResult = await axios.put(`${API_URL}product/${data.id}`, updateData);

      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Updated",
            alertType: "success",
          },
        });
        dispatch({
          type: SET_REDIRECT,
          payload: { shallRedirect: true, redirectTo: "/product" },
        });
      }
    } catch (err) {
      if (err.response) {
        let msg = err.response.data.error.message;
        msg = msg.split(":").pop();
        dispatch({
          type: ALERT_STATE,
          payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
        });
      } else console.log(err);
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { loading: false },
      });
    }
  };
};

export const deleteProduct = (id: string | number, token: string): AppThunk => {
  return async (dispatch) => {
    try {
      const payloadResult = await axios.delete(`${API_URL}product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // to use, data is returned as prodRes.data
      if (payloadResult.status === 200 || payloadResult.status === 204) {
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: "Successfully Deleted",
            alertType: "success",
          },
        });
      }

      dispatch({
        type: DELETE_PRODUCT,
        payload: { id },
      });
    } catch (err) {
      let msg = err.response.data.error.message;
      msg = msg.split(":").pop();
      dispatch({
        type: ALERT_STATE,
        payload: { alertOpen: true, alertMessage: msg, alertType: "error" },
      });
    }
  };
};

export const importProductList =
  (productFile: File, userCompanyId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { importLoading: true },
      });
      const {
        userDetails: { companyId },
      } = getState().system.session;
      const form = new FormData();
      form.append("uploads[]", productFile, productFile.name);
      const importRes = await axios.post(
        `${API_URL}media/excel/upload/product?companyId=${
          userCompanyId ? userCompanyId : companyId
        }`,
        form
      );
      if ([200, 204].includes(importRes.status)) {
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            importProductList: importRes.data,
            dialogOpen: true,
          },
        });
      }
    } catch (e) {
      let msg = "";
      if (e.response) {
        e.response.status === 409
          ? (msg = e.response.data.message)
          : (msg = e.response.data.error.message);
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: msg.split(":").pop(),
            alertType: "error",
          },
        });
      } else console.log(e);
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { importLoading: false },
      });
    }
  };

export const saveImportedProductList = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { importLoading: true },
    });
    const {
      userDetails: { companyId },
    } = getState().system.session;
    const { selectedCompanyId, importProductList } = getState().productState;
    const importRes = await axios.post(
      `${API_URL}product/import?companyId=${selectedCompanyId ? selectedCompanyId : companyId}`,
      importProductList
    );
    if (importRes.status === 200) {
      dispatch({
        type: ALERT_STATE,
        payload: {
          alertOpen: true,
          alertMessage: "Products successfully imported",
          alertType: "success",
        },
      });
      dispatch(
        getProductList(getState().system, selectedCompanyId ? selectedCompanyId : companyId)
      );
    }
  } catch (e) {
    let msg = "";
    if (e.response) {
      e.response.status === 409
        ? (msg = e.response.data.message)
        : (msg = e.response.data.error.message);
      dispatch({
        type: ALERT_STATE,
        payload: {
          alertOpen: true,
          alertMessage: msg.split(":").pop(),
          alertType: "error",
        },
      });
    } else console.log(e);
  } finally {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { importLoading: false, dialogOpen: false },
    });
  }
};

export const importProductFeature =
  (featureFile: File, type: "standard" | "optional", userCompanyId?: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { importLoading: true },
      });
      const {
        userDetails: { companyId },
      } = getState().system.session;
      const form = new FormData();
      form.append("uploads[]", featureFile, featureFile.name);
      const importRes = await axios.post(
        `${API_URL}media/excel/upload/${type}?companyId=${
          userCompanyId ? userCompanyId : companyId
        }`,
        form
      );
      if ([200, 204].includes(importRes.status)) {
        // const key = `${type}MachineFeature` as keyof typeof product;
        dispatch({
          type: SET_PRODUCT_STATE,
          payload: {
            importFeatureList: importRes.data,
            featureImportDialogOpen: true,
            featureImportType: type,
          },
        });
      }
    } catch (e) {
      let msg = "";
      if (e.response) {
        e.response.status === 409
          ? (msg = e.response.data.message)
          : (msg = e.response.data.error.message);
        dispatch({
          type: ALERT_STATE,
          payload: {
            alertOpen: true,
            alertMessage: msg.split(":").pop(),
            alertType: "error",
          },
        });
      } else console.log(e);
    } finally {
      dispatch({
        type: SET_PRODUCT_STATE,
        payload: { importLoading: false },
      });
    }
  };

export const saveProductFeature = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { importLoading: true },
    });
    // const { userDetails: { companyId } } = getState().system.session;
    const { product, importFeatureList, featureImportType } = getState().productState;
    const importRes = await axios.post(
      `${API_URL}product/import/${featureImportType}?productId=${product!.id}`,
      importFeatureList
    );
    if (importRes.status === 200) {
      dispatch({
        type: ALERT_STATE,
        payload: {
          alertOpen: true,
          alertMessage: "Features successfully imported",
          alertType: "success",
        },
      });
      dispatch(loadProductDetails(getState().productState.product!.id));
    }
  } catch (e) {
    let msg = "";
    if (e.response) {
      e.response.status === 409
        ? (msg = e.response.data.message)
        : (msg = e.response.data.error.message);
      dispatch({
        type: ALERT_STATE,
        payload: {
          alertOpen: true,
          alertMessage: msg.split(":").pop(),
          alertType: "error",
        },
      });
    } else console.log(e);
  } finally {
    dispatch({
      type: SET_PRODUCT_STATE,
      payload: { importLoading: false, featureImportDialogOpen: false },
    });
  }
};

// selectors [added by jeff]
export const selectProductState = (state: AppState) => state.productState;
