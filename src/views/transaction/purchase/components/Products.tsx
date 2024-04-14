import {
  Grid,
  IconButton,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  IProduct,
  ISelectedProduct,
  IVoucher,
  IdState,
} from "../../../../interfaces/purchase";
import { IAutoComplete } from "../interfaces";
import { useEffect, useState, useMemo } from "react";
import { BiPlus } from "react-icons/bi";
import { MdAddToPhotos } from "react-icons/md";
import { useHistory, useParams } from "react-router";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import {
  ACCOUNT_ID,
  ADDITIONAL_COST_CREDIT,
  UPDATE_TYPE,
} from "../../../../utils/const/const";
import { IParams } from "../../../../interfaces/params";
import { errorMessage } from "../../../../utils/messageBox/Messages";

interface IProps {
  accountData: IAutoComplete[];
  selectedVoucher: IVoucher[];
  products: IProduct[];
  selectedProducts: ISelectedProduct[];
  selectedAccountData: IVoucher[];
  addNewProduct: () => void;
  updateSelectedProduct: (
    index: number,
    name: string,
    value: any,
    recordId?: number,
    additionalCostName?: string
  ) => void;
  updateSelectedVoucher: (index: number, name: string, value: any) => void;
  updateSelectedAccountData: (
    index: number,
    name: string,
    value: any,
    accountId?: number
  ) => void;
  deleteSelectedProduct: (index: number) => void;
  total: number;
  vattotal: number;
  moredetails: IVoucher[];
  excisedutytotal: number;
  discounttotal: number;
  taxabletotal: number;
  nontaxabletotal: number;
  setSelectedProducts: any;
  Ids: IdState;
}

const Products = ({
  accountData,
  selectedVoucher,
  products,
  selectedProducts,
  addNewProduct,
  updateSelectedProduct,
  updateSelectedVoucher,
  updateSelectedAccountData,
  moredetails,
  deleteSelectedProduct,
  setSelectedProducts,
  selectedAccountData,
  total,
  vattotal,
  excisedutytotal,
  discounttotal,
  taxabletotal,
  nontaxabletotal,
  Ids,
}: IProps) => {
  const history = useHistory();
  const { id }: IParams = useParams();

  const [normalizedProducts, setNormalizedProducts] = useState<IAutoComplete[]>(
    []
  );
  const [quantity, setQuantity] = useState(0);

  const [taxabletotalValue, settaxabletotalv] = useState<number>(0);
  const [discountInputValue, setDiscountInputValue] = useState<number>(
    discounttotal * quantity
  );

  const [exciseDutyInputValue, setExciseDutyInputValue] = useState<number>(0);
  const [excisedutytotalValue, setexcisedutytotal] =
    useState<any>(excisedutytotal);
  const [discounttotalValue, setDiscounttotal] = useState<any>(discounttotal);

  const [showSectionNonTaxabletotal, setShowSectionNontaxabletotal] =
    useState(false);
  const [showSectiontaxabletotal, setShowSectiontaxabletotal] = useState(false);
  const [showSectionDiscount, setShowSectionDiscount] = useState(false);
  const [showSectionImportDuty, setShowSectionImportDuty] = useState(false);
  const [showSectionexciseduty, setShowexciseduty] = useState(false);
  const [showexcisedutytotal, setShowexcisedutytotal] = useState(false);

  const [exciesduty, setExciesDuty] = useState<any>([]);
  const [discountSelected, setDiscountSelected] = useState<boolean>(false);
  const [exciseDuySelected, setExciseDutySelected] = useState<boolean>(false);

  const [totaltaxable, setTotalTaxable] = useState<any>([]);
  const [totalnontaxable, setTotalNonTaxable] = useState<any>([]);
  const [totalvat, setTotalVat] = useState<any>([]);

  const [importDutyAccountId, setImportDutyAccountId] = useState<any>(0);
  const [exciseDutyAccountId, setExciseDutyAccountId] = useState(0);
  const [taxablePurchaseAccountId, setTaxablePurchaseAccountId] = useState(
    Ids.taxable.accountId == 0
      ? accountData.find(
          (data) => ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.value === data.label
        )?.id
      : Ids.taxable.accountId
  );
  const [vatAccountId, setVatAccountId] = useState(
    Ids.vat.accountId == 0
      ? accountData.find(
          (data) => ADDITIONAL_COST_CREDIT.TOTAL_VAT.value === data.label
        )?.id
      : Ids.vat.accountId
  );
  const [nonTaxablePurchaseAccountId, setNonTaxablePurchaseAccountId] =
    useState(
      Ids.nonTaxable.accountId == 0
        ? accountData.find(
            (data) =>
              ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.value === data.label
          )?.id
        : Ids.nonTaxable.accountId
    );
  const [discountAccountId, setDiscountAccountId] = useState(0);

  const [extraimportdutyAccountId, setExtraImportDutyAccountId] =  useState<any>(0);
  const [totaldiscountAccountId, setTotalDiscountAccountId] = useState<any>(0);

  const [totalTaxableValue, setTotalTaxableValue] = useState(taxabletotal);
  const [totalNonTaxableValue, setTotalNonTaxableValue] =  useState(nontaxabletotal);

  const accountingArray = [
    { accountId: exciseDutyAccountId, value: excisedutytotalValue },
    { accountId: taxablePurchaseAccountId, value: totaltaxable },
    { accountId: nonTaxablePurchaseAccountId, value: totalNonTaxableValue },
    { accountId: totaldiscountAccountId, value: discountInputValue },
  ];

  const isAccountAlreadyUsed = (accountId: any) => {
    const usedAccount = accountingArray.find(
      (item) => item.accountId === accountId
    );
    return !!usedAccount;
  };

  const handleAccountPresent = (
    accountIdFind: any,
    newValue: any,
    setValueFunction: any
  ) => {
    accountingArray.forEach((item) => {
      if (item.accountId === accountIdFind && item.accountId > 0) {
        if (taxabletotalValue > 0 || taxabletotal > 0) {
          let updatedTotalTaxable = totalTaxableValue;
          updatedTotalTaxable =
            totalTaxableValue + Number(item.value) - Number(newValue);
          item.value = newValue;
          setTotalTaxableValue(updatedTotalTaxable);
          setTotalNonTaxableValue(0);
        } else {
          let updatedTotalTaxable = totalNonTaxableValue;
          updatedTotalTaxable =
            totalNonTaxableValue + Number(item.value) - Number(newValue);
          item.value = newValue;
          setTotalNonTaxableValue(updatedTotalTaxable);
          setTotalTaxableValue(0);
        }
        setValueFunction(newValue);
      }
    });
  };

  const handleAccountChange = (
    accountId: any,
    setValueFunction: any,
    valueData: any
  ) => {
    const isAccountUsed = isAccountAlreadyUsed(accountId);
    if (!isAccountUsed && accountId > 0) {
      setValueFunction(accountId);
      if (taxabletotalValue > 0 || taxabletotal > 0) {
        setTotalTaxableValue(totalTaxableValue - valueData);
        setTotalNonTaxableValue(0);
      } else {
        setTotalNonTaxableValue(totalNonTaxableValue - valueData);
        setTotalTaxableValue(0);
      }
    } else {
      setValueFunction(0);
    }
  };

  useEffect(() => {
    setexcisedutytotal(excisedutytotal);
    setDiscounttotal(discounttotal);
  }, [discounttotal, excisedutytotal]);

  //for Non Taxable Total
  useEffect(() => {
    if (taxabletotalValue > 0 || taxabletotal > 0) {
      setShowSectiontaxabletotal(true);
      setTotalTaxableValue(taxabletotal);
      setShowSectionNontaxabletotal(false);
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
        UPDATE_TYPE.DEBIT,
        taxabletotal,
        Ids.taxable.id
      );
      if (taxabletotal > 0) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
          "IsTaxable",
          true,
          Ids.taxable.id
        );
      }

      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
        UPDATE_TYPE.ACCOUNT_ID,
        Ids.taxable.accountId === 0
          ? accountData.find(
              (data) =>
                data.label === ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.value
            )?.id
          : Ids.taxable.accountId,
        Ids.taxable.id
        // ACCOUNT_ID.TAXABLE_PURCHSE
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
        "Name",
        ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.value,
        Ids.taxable.id

        // ACCOUNT_ID.TAXABLE_PURCHSE
      );
      if (nontaxabletotal === 0) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
          UPDATE_TYPE.ACCOUNT_ID,
          0,
          Ids.nonTaxable.id

          // ACCOUNT_ID.NON_TAXABLE_PURCHSE
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
          "IsNonTaxable",
          false,
          Ids.nonTaxable.id
        );
      }
    }
    if (nontaxabletotal > 0) {
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
        UPDATE_TYPE.DEBIT,
        nontaxabletotal,
        Ids.nonTaxable.id
        // ACCOUNT_ID.NON_TAXABLE_PURCHSE
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
        UPDATE_TYPE.ACCOUNT_ID,
        Ids.nonTaxable.accountId === 0
          ? accountData.find(
              (data) =>
                data.label === ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.value
            )?.id
          : Ids.nonTaxable.accountId,
        Ids.nonTaxable.id

        // ACCOUNT_ID.NON_TAXABLE_PURCHSE
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
        "Name",
        ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.value,
        Ids.nonTaxable.id
      );
      if (nontaxabletotal > 0) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
          "IsNonTaxable",
          true,
          Ids.nonTaxable.id
        );
      }
      if (taxabletotal === 0) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
          UPDATE_TYPE.ACCOUNT_ID,
          0,
          Ids.taxable.id

          // ACCOUNT_ID.VAT
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
          UPDATE_TYPE.ACCOUNT_ID,
          0,
          Ids.taxable.id
          // ACCOUNT_ID.TAXABLE_PURCHSE
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
          "IsTaxable",
          false,
          Ids.taxable.id
        );
        setShowSectiontaxabletotal(false);
      }
      setShowSectionNontaxabletotal(true);
      setTotalNonTaxableValue(nontaxabletotal);
    }
  }, [taxabletotalValue, taxabletotal, nontaxabletotal]);

  //for Taxable Total
  useEffect(() => {
    if (taxabletotal > 0) {
      setShowSectiontaxabletotal(true);
      if (nontaxabletotal === 0) {
        setShowSectionNontaxabletotal(false);
      }
    } else {
      setShowSectiontaxabletotal(false);
      setShowSectionNontaxabletotal(true);
    }
  }, [taxabletotal]);

  //for Discount
  useEffect(() => {
    if (discounttotal > 0) {
      if (
        discountSelected &&
        (discountInputValue > 0 || discountAccountId !== 0) // update selected account array only if input value is not 0 or account id id not 0
      ) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.Discount.index,
          UPDATE_TYPE.ACCOUNT_ID,
          Ids.discount.accountId === 0
            ? accountData.find(
                (data) => data.label === ADDITIONAL_COST_CREDIT.Discount.value
              )?.id
            : Ids.discount.accountId,
          Ids.discount.id
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.Discount.index,
          UPDATE_TYPE.DEBIT,
          discounttotal,
          Ids.discount.id
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.Discount.index,
          "Name",
          ADDITIONAL_COST_CREDIT.Discount.value,
          Ids.discount.id
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.Discount.index,
          "IsDiscount",
          true,
          Ids.discount.id
        );
      }

      if (discountInputValue === 0) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.Discount.index,
          UPDATE_TYPE.DEBIT,
          discountInputValue,
          Ids.discount.id
        );
      }
      //condition to set discount id
      if (id == "add") {
        setDiscountAccountId(
          accountData.find(
            (data) => ADDITIONAL_COST_CREDIT.Discount.value === data.label
          )?.id || 0
        );
      } else if (Ids.discount.debit !== 0 || discountInputValue > 0) {
        // setDiscountAccountId(Ids.discount.accountId)
        setDiscountAccountId(
          accountData.find(
            (data) => ADDITIONAL_COST_CREDIT.Discount.value === data.label
          )?.id || 0
        );
      }

      setShowSectionDiscount(true);
    } else {
      setShowSectionDiscount(false);
    }
  }, [discounttotal]);

  //for Excise Duty
  useEffect(() => {
    if (excisedutytotal > 0) {
      if (
        (exciseDuySelected || excisedutytotal === 0) &&
        exciseDutyAccountId !== 0
      ) {
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
          UPDATE_TYPE.ACCOUNT_ID,
          Ids.exciseDuty.accountId === 0
            ? accountData.find(
                (data) =>
                  data.label === ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value
              )?.id
            : Ids.exciseDuty.accountId,
          Ids.exciseDuty.id
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
          UPDATE_TYPE.DEBIT,
          excisedutytotalValue,
          Ids.exciseDuty.id

          // ACCOUNT_ID.EXCISE_DUTY
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
          "Name",
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value,
          Ids.exciseDuty.id
          // ACCOUNT_ID.EXCISE_DUTY
        );
        updateSelectedAccountData(
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
          "IsExciseDuty",
          true,
          Ids.exciseDuty.id

          // ACCOUNT_ID.EXCISE_DUTY
        );
      }
      setShowexciseduty(true);
      if (id == "add") {
        setExciseDutyAccountId(
          accountData.find(
            (data) => ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value === data.label
          )?.id || 0
        );
      } else if (
        (Ids.exciseDuty.accountId !== 0 &&
          Ids.exciseDuty.debit > 0 &&
          exciseDuySelected) ||
        exciseDutyInputValue > 0
      ) {
        setExciseDutyAccountId(
          accountData.find(
            (data) => ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value === data.label
          )?.id || 0
        );
      }

      setExciesDuty(ACCOUNT_ID.EXCISE_DUTY);
    } else {
      setShowexciseduty(false);
    }
  }, [excisedutytotal, exciseDuySelected, excisedutytotalValue]);

  //for VAT
  useEffect(() => {
    if (vattotal > 0) {
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
        UPDATE_TYPE.ACCOUNT_ID,
        Ids.vat.accountId === 0
          ? accountData.find(
              (data) => data.label === ADDITIONAL_COST_CREDIT.TOTAL_VAT.value
            )?.id
          : Ids.vat.accountId,
        Ids.vat.id
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
        UPDATE_TYPE.DEBIT,
        vattotal,
        Ids.vat.id

        // ACCOUNT_ID.VAT
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
        "Name",
        ADDITIONAL_COST_CREDIT.TOTAL_VAT.value,
        Ids.vat.id
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
        "IsVAT",
        true,
        Ids.vat.id
      );
    }
  }, [vattotal]);

  const getAccountData = (id: number): IAutoComplete | null => {
    for (let index = 0; index < accountData.length; index++) {
      const element = accountData[index];
      if (id === element.id) {
        return { id: element.id, label: element.label };
      }
    }
    return null;
  };

  useEffect(() => {
    setNormalizedProducts(
      products.map((data) => {
        return { id: data.Id, label: data.Name };
      })
    );
  }, [products]);

  useEffect(() => {
    if (showSectionDiscount) {
      setDiscountSelected(true);
    }
  }, [showSectionDiscount]);

  useEffect(() => {
    if (showSectionexciseduty) {
      setExciseDutySelected(true);
    }
  }, [showSectionexciseduty]);

  const getItemValue = (selectedProductId: number): IAutoComplete | null => {
    for (let index = 0; index < products.length; index++) {
      const element = products[index];

      if (selectedProductId === element.Id) {
        return { id: element.Id, label: element.Name };
      }
    }
    return null;
  };

  const showVoucherSection =
    discounttotal > 0 ||
    taxabletotal > 0 ||
    nontaxabletotal > 0 ||
    vattotal > 0 ||
    excisedutytotal > 0;

  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={2}>
          {selectedProducts.map((data, index) => {
            return (
              <>
                <Grid item xs={12} key={index} sx={{ marginTop: 2 }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ width: "calc(100% - 50px)", float: "left" }}
                  >
                    <Grid item xs={12} md={8}>
                      <Autocomplete
                        style={{ width: "calc(100% - 50px)", float: "left" }}
                        disablePortal
                        options={normalizedProducts}
                        size="small"
                        value={getItemValue(data.InventoryItemId)}
                        isOptionEqualToValue={(
                          option: IAutoComplete,
                          value: IAutoComplete
                        ) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField {...params} label="Item name" />
                        )}
                        onChange={(
                          event: any,
                          newValue: IAutoComplete | null
                        ) => {
                          updateSelectedProduct(
                            index,
                            "InventoryItemId",
                            newValue && newValue.id
                          );
                        }}
                        renderOption={handleRenderOption}
                      />
                      <IconButton
                        style={{
                          float: "left",
                          width: "45px",
                          height: "38px",
                        }}
                        sx={{ border: 1, borderRadius: 1 }}
                        onClick={(e) => history.push("/products/add")}
                      >
                        <MdAddToPhotos />
                      </IconButton>
                    </Grid>

                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Quantity"
                        type="number"
                        size="small"
                        InputProps={{ inputProps: { min: "" } }}
                        value={data && data.Quantity ? data.Quantity : "0"}
                        fullWidth
                        onChange={(e) => {
                          updateSelectedProduct(
                            index,
                            "Quantity",
                            Number(e.target.value)
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Purchase Price Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.PurchaseRate ? data.PurchaseRate : "0"}
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "PurchaseRate",
                            Number(e.target.value)
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Excise Duty Rate %"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.ExciseDutyRate ? data.ExciseDutyRate : "0"}
                        onChange={(e) => {
                          updateSelectedProduct(
                            index,
                            "ExciseDutyRate",
                            Number(e.target.value)
                          );
                          setexcisedutytotal(parseFloat(e.target.value));
                          setExciseDutyInputValue(parseFloat(e.target.value));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Excise Duty Amount"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.ExciseDuty ? data.ExciseDuty : "0"}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="After Excise Duty"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.AfterExciseDuty ? data.AfterExciseDuty : "0"}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Discount"
                        size="small"
                        type="number"
                        fullWidth
                        value={data.Discount ? data.Discount : "0"}
                        onChange={(e) => {
                          updateSelectedProduct(
                            index,
                            "Discount",
                            Number(e.target.value)
                          );
                          setDiscountInputValue(parseFloat(e.target.value));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Before Price VAT"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.BeforePriceVAT ? data.BeforePriceVAT : "0" } />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Gross Value"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.PurchaseAmount ? data.PurchaseAmount : "0"}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="VAT Rate"
                        size="small"
                        type="number"
                        fullWidth
                        value={data.TaxRate ? data.TaxRate : "0"}
                        onChange={(e) => {
                          updateSelectedProduct(
                            index,
                            "TaxRate",
                            Number(e.target.value)
                          );
                          settaxabletotalv(parseFloat(e.target.value));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="After VAT"
                        size="small"
                        type="number"
                        fullWidth
                        value={Number(data.AfterVatAmount ? data.AfterVatAmount : "0"
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Total Value"
                        size="small"
                        type="number"
                        fullWidth
                        value={data.TotalPurchaseValue}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    key={`delete${index}`}
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    <Box>
                      {selectedProducts.length > 1 ? (
                        <IconButton
                          onClick={() => deleteSelectedProduct(index)}
                        >
                          <BackspaceIcon sx={{ color: "red" }} />
                        </IconButton>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </>
            );
          })}
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
          <Button
            variant="outlined"
            onClick={addNewProduct}
            sx={{ marginLeft: 3 }}
          >
            <BiPlus />
            Add
          </Button>
        </Box>
        <Grid xs={12} container spacing={2}>
          <div style={{ display: showVoucherSection ? "contents" : "none" }}>
            {selectedAccountData?.map((data, index) => {
              if (index === 0) {
                return (
                  <>
                    <div
                      style={{
                        display: showSectionImportDuty ? "contents" : "none",
                      }}
                    >
                    </div>
                    <div
                      style={{
                        display: showSectionexciseduty ? "contents" : "none",
                      }}
                    >
                      {/* Total Excies Duty )} */}
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              options={accountData}
                              size="small"
                              isOptionEqualToValue={(
                                option: IAutoComplete,
                                value: IAutoComplete
                              ) => option.id === value.id}
                              value={getAccountData(
                                Number(exciseDutyAccountId)
                              )}
                              renderInput={(params) => (
                                <TextField {...params} label="Account" />
                              )}
                              onChange={(
                                event: any,
                                newValue: IAutoComplete | null
                              ) => {
                                const checkAccount = selectedAccountData.some(
                                  (data) => data.AccountId == newValue?.id
                                );
                                if (checkAccount) {
                                  errorMessage("Please select a new account.");
                                  return;
                                }
                                if (newValue === null) {
                                  setExciseDutySelected(false);
                                } else {
                                  setExciseDutySelected(true);
                                }
                                handleAccountChange(
                                  newValue ? newValue.id : null,
                                  setExciseDutyAccountId,
                                  excisedutytotalValue
                                );

                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
                                  "AccountId",
                                  newValue && newValue.id,
                                  Ids.exciseDuty.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
                                  "Debit",
                                  newValue !== null
                                    ? parseInt(excisedutytotalValue)
                                    : 0,
                                  Ids.exciseDuty.id
                                );

                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
                                  "Name",
                                  ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value,
                                  Ids.exciseDuty.id
                                );
                              }}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total Excies Duty"
                              size="small"
                              fullWidth
                              // e
                              value={excisedutytotalValue}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) =>
                                    data.AccountId === exciseDutyAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index,
                                  "Description",
                                  e.target.value,
                                  Ids.exciseDuty.id
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    <div
                      style={{
                        display: showSectionDiscount ? "contents" : "none",
                      }}
                    >
                       {/* Total Discount )} */}
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              options={accountData}
                              size="small"
                              isOptionEqualToValue={(
                                option: IAutoComplete,
                                value: IAutoComplete
                              ) => option.id === value.id}
                              value={getAccountData(Number(discountAccountId))}
                              renderInput={(params) => (
                                <TextField {...params} label="Account" />
                              )}
                              onChange={(
                                event: any,
                                newValue: IAutoComplete | null
                              ) => {
                                const checkAccount = selectedAccountData.some(
                                  (data) => data.AccountId == newValue?.id
                                );
                                if (checkAccount) {
                                  errorMessage("Please select a new account.");
                                  return;
                                }
                                handleAccountChange(
                                  newValue ? newValue.id : null,
                                  setDiscountAccountId,
                                  discounttotalValue
                                );
                                if (newValue === null) {
                                  setDiscountSelected(false);
                                } else {
                                  setDiscountSelected(true);
                                }

                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.Discount.index,
                                  "AccountId",
                                  newValue && newValue.id,
                                  Ids.discount.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.Discount.index,
                                  "Debit",
                                  newValue !== null ? discounttotal : 0,
                                  Ids.discount.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.Discount.index,
                                  "Name",
                                  ADDITIONAL_COST_CREDIT.Discount.value,
                                  Ids.discount.id
                                );
                              }}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total Discount"
                              size="small"
                              fullWidth
                              value={discounttotal}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) => data.AccountId === discountAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.Discount.index,
                                  "Description",
                                  e.target.value,
                                  Ids.discount.id
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    {/* Total Taxable)} */}
                    <div
                      style={{
                        display: showSectiontaxabletotal ? "contents" : "none",
                      }}
                    >
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              options={accountData}
                              getOptionLabel={(option) => option.label}
                              size="small"
                              isOptionEqualToValue={(
                                option: IAutoComplete,
                                value: IAutoComplete
                              ) => option.id === value.id}
                              value={getAccountData(
                                Number(taxablePurchaseAccountId)
                              )}
                              onChange={(
                                event: any,
                                newValue: IAutoComplete | null
                              ) => {
                                const checkAccount = selectedAccountData.some(
                                  (data) => data.AccountId == newValue?.id
                                );
                                if (checkAccount) {
                                  errorMessage("Please select a new account.");
                                  return;
                                }
                                handleAccountChange(
                                  newValue ? newValue.id : null,
                                  setTaxablePurchaseAccountId,
                                  totalTaxableValue
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
                                  "Debit",
                                  totalTaxableValue
                                    ? totalTaxableValue
                                    : taxabletotal,
                                  Ids.taxable.id
                                  // ACCOUNT_ID.TAXABLE_PURCHSE
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
                                  "AccountId",
                                  newValue && newValue.id,
                                  Ids.taxable.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
                                  "Name",
                                  ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.value,
                                  Ids.taxable.id
                                );
                              }}
                              renderInput={(params) => (
                                <TextField {...params} label="Account" />
                              )}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total TAXable"
                              size="small"
                              fullWidth
                              value={taxabletotal}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) =>
                                    data.AccountId === taxablePurchaseAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index,
                                  "Description",
                                  e.target.value,
                                  Ids.taxable.id
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    {/* Non Taxable Show Hide)} */}
                    <div
                      style={{
                        display: showSectionNonTaxabletotal ? "contents" : "none",
                      }}
                    >
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              options={accountData}
                              size="small"
                              isOptionEqualToValue={(
                                option: IAutoComplete,
                                value: IAutoComplete
                              ) => option.id === value.id}
                              value={getAccountData(
                                Number(nonTaxablePurchaseAccountId)
                              )}
                              onChange={(
                                event: any,
                                newValue: IAutoComplete | null
                              ) => {
                                const checkAccount = selectedAccountData.some(
                                  (data) => data.AccountId == newValue?.id
                                );
                                if (checkAccount) {
                                  errorMessage("Please select a new account.");
                                  return;
                                }
                                handleAccountChange(
                                  newValue ? newValue.id : null,
                                  setNonTaxablePurchaseAccountId,
                                  totalnontaxable
                                );

                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE
                                    .index,
                                  "Debit",
                                  totalnontaxable,
                                  Ids.nonTaxable.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE
                                    .index,
                                  "AccountId",
                                  newValue && newValue.id,
                                  Ids.nonTaxable.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE
                                    .index,
                                  "Name",
                                  ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE
                                    .value,
                                  Ids.nonTaxable.id
                                );
                              }}
                              renderInput={(params) => (
                                <TextField {...params} label="Account" />
                              )}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total Non TAXable"
                              size="small"
                              fullWidth
                              value={
                                totalNonTaxableValue
                                  ? totalNonTaxableValue
                                  : nontaxabletotal
                              }
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) =>
                                    data.AccountId ===
                                    nonTaxablePurchaseAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE
                                    .index,
                                  "Description",
                                  e.target.value
                                  // ACCOUNT_ID.NON_TAXABLE_PURCHSE
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    {/* Total Tax Show Hide)} */}
                    {vattotal > 0 ? (
                      <Grid item xs={12} key={index}>
                        <Grid container spacing={2} sx={{ marginTop: 3 }}>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              options={accountData}
                              getOptionLabel={(option) =>
                                ADDITIONAL_COST_CREDIT.TOTAL_VAT.value
                              }
                              size="small"
                              isOptionEqualToValue={(
                                option: IAutoComplete,
                                value: IAutoComplete
                              ) => option.id === value.id}
                              value={totalvat && totalvat}
                              renderInput={(params) => (
                                <TextField {...params} label="Account" />
                              )}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total VAT"
                              size="small"
                              fullWidth
                              value={Number(vattotal).toFixed(2)}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) => data.AccountId === vatAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.TOTAL_VAT.index,
                                  "Description",
                                  e.target.value
                                  // ACCOUNT_ID.VAT
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </>
                );
              }
            })}
            {/* {voucherSection} */}
          </div>
        </Grid>
      </Box>
    </>
  );
};

export default Products;
