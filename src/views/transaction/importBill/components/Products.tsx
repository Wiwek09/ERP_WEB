import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { MdAddToPhotos } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";

import { ICompany } from "../../../../interfaces/company";
import {
  IAdditionalLocalCost,
  IProduct,
  ISelectedBillProduct,
  IVoucher,
  IdState,
} from "../../../../interfaces/importBill";
import { deleteJournalRow } from "../../../../services/journalApi";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { IAutoComplete } from "../interfaces";
import { WidthFull } from "@mui/icons-material";
import { ACCOUNT_ID, ADDITIONAL_COST_CREDIT, UPDATE_TYPE } from "../../../../utils/const/const";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { IParams } from "../../../../interfaces/params";
import { useParams } from "react-router-dom";


interface IProps {
  company: ICompany;
  billTerm: any[];
  accountData: IAutoComplete[];
  selectedAccountData: IVoucher[];
  products: IProduct[];
  selectedProducts: ISelectedBillProduct[];
  addNewProduct: () => void;
  updateSelectedProduct: (index: number, name: string, value: any) => void;
  updateSelectedVoucher: (index: number, name: string, value: any) => void;
  deleteSelectedProduct: (index: number) => void;
  updateSelectedAccountData: (
    index: number,
    name: string,
    value: any,
    accountId?: number
  ) => void;
  vattotal: number;
  moredetails: IVoucher[];
  importdutytotal: number;
  excisedutytotal: number;
  discounttotal: number;
  taxabletotal: number;
  nontaxabletotal: number;
  setSelectedProducts: any;
  addNewLocalCost: () => void;
  additionalLocalCost: IAdditionalLocalCost[];
  // updateLocalCost: (index: number, name: string, value: any) => void;
  deleteLocalCost: (index: number) => void;
  ledgerData: any[];
  Ids: IdState;
  showAdditionalCost:{key:string , open :boolean},
  setShowAdditionalCost:any
}

const Products = ({
  company,
  billTerm,
  accountData,
  selectedAccountData,
  products,
  selectedProducts,
  addNewProduct,
  updateSelectedProduct,
  updateSelectedVoucher,
  moredetails,
  deleteSelectedProduct,
  setSelectedProducts,
  updateSelectedAccountData,
  vattotal,
  importdutytotal,
  excisedutytotal,
  discounttotal,
  taxabletotal,
  nontaxabletotal,
  addNewLocalCost,
  additionalLocalCost,
  // updateLocalCost,
  deleteLocalCost,
  ledgerData,
  Ids,
  showAdditionalCost,
  setShowAdditionalCost
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
  const [importDutytotalValue, setImportDutytotal] =
    useState<any>(importdutytotal);
  const [excisedutytotalValue, setexcisedutytotal] =
    useState<any>(excisedutytotal);
  const [discounttotalValue, setDiscounttotal] = useState<any>(discounttotal);

  const [importDutyInputValue, setImportDutyInputValue] = useState<number>(0);

  const [exciseDutyInputValue, setExciseDutyInputValue] = useState<number>(0);

  const [showSectionNonTaxabletotal, setShowSectionNontaxabletotal] =
    useState(false);
  const [showSectiontaxabletotal, setShowSectiontaxabletotal] = useState(false);
  const [showSectionImportDuty, setShowSectionImportDuty] = useState(false);
  const [showSectionexciseduty, setShowexciseduty] = useState(false);

  const [exciesduty, setExciesDuty] = useState<any>([]);
  const [totaltaxable, setTotalTaxable] = useState<any>([]);
  const [totalnontaxable, setTotalNonTaxable] = useState<any>([]);
  const [totalvat, setTotalVat] = useState<any>([]);

  const [importDutyAccountId, setImportDutyAccountId] = useState<any>(   Ids.importDuty.accountId == 0
    ? accountData.find(
        (data) => ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value === data.label
      )?.id
    : Ids.importDuty.accountId);

  const [exciseDutyAccountId, setExciseDutyAccountId] = useState(0);
  const [totaldiscountAccountId, setTotalDiscountAccountId] = useState<any>(0);

  const [totalTaxableValue, setTotalTaxableValue] = useState(taxabletotal);
  const [totalNonTaxableValue, setTotalNonTaxableValue] =
    useState(nontaxabletotal);

  const [importDutySelected,setImportDutySelected] = useState<boolean>(false);
  const [exciseDuySelected, setExciseDutySelected] = useState<boolean>(false);

  //NEW

  const [totalavgvalue,setTotalAvgValue] = useState({additional: 0,localAdditional: 0})

  const [currentProduct, setCurrentProduct] = useState(-1);
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
    const accountingArray = [
      {accountId: importDutyAccountId, value: importDutytotalValue},
      { accountId: exciseDutyAccountId, value: excisedutytotalValue },
      { accountId: taxablePurchaseAccountId, value: totaltaxable },
      { accountId: nonTaxablePurchaseAccountId, value: totalNonTaxableValue },
      { accountId: totaldiscountAccountId, value: discountInputValue },
    ];


  const AddCost = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const AddLocalCost = [
    { label: "By Amount", value: 0 },
    { label: "By Quantity", value: 1 },
    { label: "No", value: 2 },
  ];

  const isAccountAlreadyUsed = (accountId: any) => {
    const usedAccount = accountingArray.find(
      (item) => item.accountId === accountId
    );
    return !!usedAccount;
  };

  //


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
    // console.log("Hello New account select accountId", accountId)
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
    if (showSectionexciseduty) {
      setExciseDutySelected(true);
    }
  }, [showSectionexciseduty]);

  useEffect(() => {
    setImportDutytotal(importdutytotal);
    setexcisedutytotal(excisedutytotal);
    setDiscounttotal(discounttotal);
  }, [
    importdutytotal,
    excisedutytotal,
    discounttotal,
  ]);

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
          ADDITIONAL_COST_CREDIT.EXCISE_DUTY.value
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

  //for Import Duty
  useEffect(() => {
    if (importdutytotal > 0) {
      if (
        (importDutySelected || importdutytotal === 0) &&
        importDutyAccountId !== 0
      ) {
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
        UPDATE_TYPE.ACCOUNT_ID,
        Ids.importDuty.accountId === 0
          ? accountData.find(
              (data) => data.label === ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value
            )?.id
          : Ids.importDuty.accountId,
        Ids.importDuty.id
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
        UPDATE_TYPE.DEBIT,
        importdutytotal,
        Ids.importDuty.id

        // ACCOUNT_ID.VAT
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
        "Name",
        ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value,
        Ids.importDuty.id
      );
      updateSelectedAccountData(
        ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
        "IsImportDuty",
        true,
        Ids.importDuty.id
      );
    } 
    setShowSectionImportDuty(true);
    if (id == "add") {
      setImportDutyAccountId(
        accountData.find(
          (data) => ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value === data.label
        )?.id || 0
      );
    } else if (
      (Ids.importDuty.accountId !== 0 &&
        Ids.importDuty.debit > 0 &&
        importDutySelected) ||
      importDutyInputValue > 0
    ) {
      setImportDutyAccountId(
        accountData.find(
          (data) => ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value === data.label
        )?.id || 0
      );
    }
  } else {
    setShowSectionImportDuty(false);
  }
    // else {
    //   setShowSectionImportDuty(false);
    // }
  }, [importdutytotal,importDutySelected,importDutytotalValue]);


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
    importdutytotal > 0 ||
    excisedutytotal > 0;

  const updateAdditionalCost = (index: number, key: string, value: any) => {
    const current : any = selectedProducts.find(
      (item, index) => index === currentProduct
    );
    
    const getLedgerValue = (key: string , debitValue: any) => {
      if(key === "BillTermId"){
        const ledgerValue = billTerm.find((item) => item.value === value);
        return ledgerValue?.ledgerId
      }
      return debitValue;
    }

    if (current && current?.[showAdditionalCost.key] != null) {
      const additionalCost = current?.[showAdditionalCost.key].map(
        (item : any, itemIndex : number) => {
          if (itemIndex === index) {
            return {
              BillTermId: key === "BillTermId" ? value : item?.BillTermId,
              // LedgerId: key === "LedgerId" ? value : item.LedgerId,
              CreditId: key === "CreditId" ? value : item?.CreditId,
              CreditRefId: item?.CreditRefId,
              DebitId: key === "DebitId" ? value : getLedgerValue(key, item?.DebitId),
              DebitRefId: item?.DebitRefId,
              Amount: key === "Amount" ? value : item?.Amount,
              AddCost: key === "AddCost" ? value : item?.AddCost,
            };
          }
          return item;
        }
      );
      if(showAdditionalCost.key === "AdditionalProductCost"){
      updateSelectedProduct(
        currentProduct,
        "AdditionalProductCost",
        additionalCost
      );
    }else{
      updateSelectedProduct(
        currentProduct,
        "AdditionalLocalProductCost",
        additionalCost
      )
    }
    }
    
  };

  const deleteAdditionalCost = async (index: number) => {
    const current : any = selectedProducts.find(
      (item, productIndex) => productIndex === currentProduct
    );
    if (current && current?.[showAdditionalCost.key] != null) {
      const additionalCost = current?.[showAdditionalCost.key].filter(
        (item : any, itemIndex:number) => itemIndex !== index
      );
      const data = current?.[showAdditionalCost.key].find(
        (item : any, itemIndex:number) => itemIndex === index
      );
      if (data?.CreditId) {
        await deleteJournalRow(data.CreditId);
      }
      if (data?.DebitId) {
        await deleteJournalRow(data.DebitId);
      }
      updateSelectedProduct(
        currentProduct,
        showAdditionalCost.key === "AdditionalProductCost" ? "AdditionalProductCost" : "AdditionalLocalProductCost" ,
        additionalCost
      );

    }
  };

  const getDebitValue = (value: number) => {
    const selected = ledgerData.find((item) => item.value == value);
    if(selected){
      return selected;
    }
    return {value: "", label: ""};
  }

  const additionalCost = () => {
    const current : any = selectedProducts.find(
      (item, index) => index === currentProduct
    );
    if (current != null) {
      let totalAmount = 0;
      let totalCostAmount = 0;
      return (
        <Dialog
        aria-labelledby="customized-dialog-title"
          fullWidth={true}
          open={showAdditionalCost.open}
          className="cost-dialog" maxWidth ="md" 
          disableEscapeKeyDown={true} sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1200px",  // Set your width here
              },
            },
          }}
        >

          <DialogTitle> {showAdditionalCost.key == "AdditionalProductCost" ? `Add Additional Cost` : `Add Local Additional Cost` } </DialogTitle>
          <DialogContent>
            {current?.[showAdditionalCost.key] != null && billTerm && ledgerData &&
              current?.[showAdditionalCost.key].map((item:any, index:number) => {
                const currentAmount = item.AddCost ? Number(item.Amount) : 0;
                totalAmount = totalAmount + Number(item.Amount);
                if (item.AddCost) {
                  totalCostAmount = totalCostAmount + Number(item.Amount);
                }

                const cop = billTerm.find(
                  (bt: any) => bt?.value == item?.BillTermId 
                )

                const ledgerCredit = ledgerData.find(
                  (bt: any) => bt?.value == item?.CreditId
                )

                const ledgerValue = getDebitValue(item?.DebitId)

                return (
                  <Grid container spacing={2} mt={2} key={index} >
                    <Grid item  xs={12} md={4}>
                      <Autocomplete
                        disablePortal
                        options={billTerm}
                        value={cop}
                        onChange={(e, v: any) => {                
                          updateAdditionalCost(index, "BillTermId", v.value);   
                        }}
                        
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Additional Cost of Purchase"
                            variant="outlined"
                            size="small"
                            required
                            error={!item.BillTermId}
                            fullWidth
                            helperText="Please choose additional cost of purchase"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4} key={index}>
                      <Autocomplete
                        disablePortal
                        options={ledgerData}
                        value={ledgerValue}                     
                        onChange={(e, v) => {
                          updateAdditionalCost(index, "DebitId", v.value);
                        }
                      }
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Debit Ledger"
                            variant="outlined"
                            size="small"
                            required
                            error={!item?.DebitId}
                            fullWidth
                            helperText="Please choose debit ledger"
                          />
                        )}
                      />

                    </Grid>
                    <Grid item xs={12} md={4} key={index} >
                      <Autocomplete
                        disablePortal
                        options={ledgerData}
                        value={ledgerCredit}
                        onChange={(e, v) => {
                          updateAdditionalCost(index, "CreditId",v.value);
                        }}
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Credit Ledger"
                            variant="outlined"
                            size="small"
                            required
                            error={!item?.CreditId}
                            fullWidth
                            helperText="Please choose credit ledger"
                          />
                        )}
                      />
                    </Grid>                    
                    <Grid item key={index} xs={12} md={3}>
                      <TextField
                        label="Amount"
                        type="number"
                        size="small"
                        value={item.Amount}
                        fullWidth
                        required
                        error={!item.Amount}
                        onChange={(e) => {
                          updateAdditionalCost(index, "Amount", e.target.value);
                        }}
                        helperText="Please choose amount"
                      />
                    </Grid>
                    <Grid item key={index} xs={12} md={3}>
                      <Autocomplete
                        disablePortal
                        options={AddCost}
                        value={AddCost.find(
                          (ac: any) => ac.value === item.AddCost
                        )}
                        onChange={(e, v) => {
                          updateAdditionalCost(index, "AddCost", v.value);
                        }}
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Add to Cost"
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item key={index} xs={12} md={3}>
                      <TextField
                        label="Cost Amount"
                        type="number"
                        size="small"
                        value={item.AddCost ? item.Amount : 0}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item key={index} xs={12} md={1}>
                      <IconButton onClick={() => deleteAdditionalCost(index)} >
                        <BackspaceIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      key={index}
                      xs={12}
                      md={11}
                      sx={{ textAlign: "right" }}
                    >
                      <strong>Avg. Rate : </strong>{" "}
                      {currentAmount === 0 || current.Quantity === 0
                        ? 0.0
                        : (currentAmount / current.Quantity).toFixed(2)}
                    </Grid>
                    <Grid item key={index} xs={12} md={12}>
                      <hr />
                    </Grid>
                  </Grid>
                );
              })}
            <Grid
              item
              xs={12}
              md={11}
              sx={{ textAlign: "right", padding: "10px" }}
            >
              <strong>Total Amount : </strong> {totalAmount.toFixed(2)}
              <br />
              <strong>Total Cost Amount : </strong> {totalCostAmount.toFixed(2)}
              <br />
              <strong>Total Avg. Rate : </strong>{" "}
              {totalCostAmount === 0 || current.Quantity === 0
                ? 0.0
                : (totalCostAmount / current.Quantity).toFixed(2)}
            </Grid>
            <Grid item xs={12} md={1}></Grid>
            <Grid item xs={12} md={12}>
              <Box
                sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    updateSelectedProduct(
                      currentProduct,
                      showAdditionalCost.key === "AdditionalProductCost" ? "NewAdditionalProductCost" :
                      "NewAdditionalLocalProductCost" ,
                      {
                        BillTermId: 0,
                        CreditId: 0,
                        CreditRefId: 0,
                        DebitId: 0,
                        DebitRefId: 0,
                        LedgerId: 0,
                        Amount: 0,
                        AddCost: false,
                      }
                    )
                  }
                  sx={{ marginLeft: 3 }}
                >
                  <BiPlus />
                  Add New
                </Button>
                <Button
                  variant="outlined"
                  sx={{ marginLeft: 2 }}
                  onClick={() => {
                    setCurrentProduct(-1);
                    setShowAdditionalCost({ key:showAdditionalCost.key,open:false});
                  }}
                  color={"error"}
                  startIcon={<RiDeleteBack2Fill />}
                >
                  Close
                </Button>
              </Box>
            </Grid>
          </DialogContent>
        </Dialog>
      );
    }
  };

  return (
    <>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={2}>
          {selectedProducts.map((data:any, index) => {
            console.log(data,"Selected_Products")
            let additionalCost = 0; 
            let additionalLocalCost = 0;

            if(data?.AdditionalProductCost != null || data?.AdditionalLocalProductCost){
              ["AdditionalProductCost", "AdditionalLocalProductCost"].forEach(
               (element) => {
              data?.[element].filter(
                (item:any) => item.AddCost === true
              ).map((item:any) => {
                if(element === "AdditionalProductCost"){
                additionalCost = additionalCost + Number(item.Amount)
                }
                else if(element === "AdditionalLocalProductCost"){
                  additionalLocalCost = additionalLocalCost + Number(item.Amount)
                }
              })
            }
            )
            }

            return (
              <>
                <Grid item xs={12} key={index} sx={{ marginTop: 2 }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{ width: "calc(100% - 50px)", float: "left" }}
                  >
                    <Grid item xs={12} md={12}>
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
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Source Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.SourceRate ? data.SourceRate : "0"}
                        onChange={(e) =>
                          updateSelectedProduct(
                            index,
                            "SourceRate",
                            Number(e.target.value)
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Import Rate NPR"
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.ImportRate
                            ? data.ImportRate
                            : "0.00"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Total Import NPR"
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.ImportAmount
                            ? data.ImportAmount
                            : "0.00"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Add Cost Per Item"
                        type="number"
                        size="small"
                        fullWidth
                        value={ additionalCost != 0 ?
                           (Number(additionalCost) / data.Quantity).toFixed(2)
                          : "0.0" }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={(e) => {
                                  setCurrentProduct(index);
                                  setShowAdditionalCost({key:"AdditionalProductCost",open:true});
                                }}>
                                <MdAddToPhotos />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Gross Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={data?.GrossRate ? data?.GrossRate?.toFixed(4) : "0"}/>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Import Duty Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={data.ImportDutyRate ? data.ImportDutyRate : "0"}
                        onChange={(e) => {
                          updateSelectedProduct(
                            index,
                            "ImportDutyRate",
                            Number(e.target.value)
                          );
                          setImportDutytotal(parseFloat(e.target.value));
                          setImportDutyInputValue(parseFloat(e.target.value));

                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Import Duty Amount"
                        type="number"
                        size="small"
                        fullWidth
                        value={data?.ImportDuty ? data?.ImportDuty.toFixed(2) : "0"}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="After Import Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.AfterImportDuty
                            ? data.AfterImportDuty.toFixed(4)
                            : "0"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Excise Duty Rate"
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
                        value={
                          data?.ExciseDuty ? data.ExciseDuty.toFixed(4) : "0"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="After Excise Duty "
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.GrossAmount ? data.GrossAmount.toFixed(4) : "0"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Local Add. Cost per Item (Q + A)"
                        type="number"
                        size="small"
                        fullWidth
                        value={ additionalLocalCost !=0 ?
                           (Number(additionalLocalCost) / data.Quantity).toFixed(2)
                          : "0.0" }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={(e) => {
                                  setCurrentProduct(index);
                                  setShowAdditionalCost({key:"AdditionalLocalProductCost",open:true});
                                }}>
                                <MdAddToPhotos />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Net Purchase Rate"
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.PurchaseRate ? Number(data.PurchaseRate.toFixed(4)) 
                           : "0"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Purchase Amount"
                        type="number"
                        size="small"
                        fullWidth
                        value={
                          data?.PurchaseAmount
                            ? data.PurchaseAmount.toFixed(4)
                            : "0.00"
                        }
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
                            e.target.value
                          );
                          settaxabletotalv(parseFloat(e.target.value));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="VAT on Gross Amount"
                        size="small"
                        type="number"
                        fullWidth
                        value={
                          data?.VATAmount
                            ? data.VATAmount.toFixed(4)
                            : "0.00"
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Aftr VAT Purchase Price"
                        size="small"
                        type="number"
                        fullWidth
                        value={
                          data?.AfterVatAmount
                            ? data.AfterVatAmount.toFixed(4)
                            : "0.00"
                        }
                      />
                    </Grid>                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Total Amount"
                        size="small"
                        type="number"
                        fullWidth
                        value={
                          data?.TotalPurchaseValue
                            ? data.TotalPurchaseValue.toFixed(4)
                            : "0.00"
                        }
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
        <Box sx={{ display: "flex", justifyContent: "end", margin: 2 }}>
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
          <Fragment>
            <Grid item xs={12}>
              <Fragment>
                <hr style={{ borderColor: 'black', borderWidth: '2px', width: '100%' }} />
              </Fragment>
            </Grid>
          </Fragment>
        </Grid>
        <Grid xs={12} container spacing={2}>
          <div style={{ display: showVoucherSection ? "contents" : "none" }}>
            {selectedAccountData.map((data, index) => {
              if (index === 0) {
                return (
                  <>
                    <div
                      style={{
                        display: showSectionImportDuty ? "contents" : "none",
                      }}
                    >
                      {/* Total Import Duty )} */}
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
                              value={getAccountData(Number(importDutyAccountId))}
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
                                  setImportDutySelected(false);
                                } else {
                                  setImportDutySelected(true);
                                }
                                handleAccountChange(
                                  newValue ? newValue.id : null,
                                  setImportDutyAccountId,
                                  importDutytotalValue
                                );
                                
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
                                  "AccountId",
                                  newValue && newValue.id,
                                  Ids.importDuty.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
                                  "Debit",
                                  newValue !== null
                                    ? parseInt(importDutytotalValue)
                                    : 0,
                                  Ids.importDuty.id
                                );
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
                                  "Name",
                                  ADDITIONAL_COST_CREDIT.IMPORT_DUTY.value,
                                  Ids.importDuty.id
                                );
                              }}                              
                              renderInput={(params) => (
                                <TextField required {...params}
                                error={!getAccountData(importDutyAccountId)} label="Account"  />
                              )}
                              renderOption={handleRenderOption}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Total Import Duty"
                              size="small"
                              fullWidth
                              value={importDutytotalValue.toFixed(2)}
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Description"
                              size="small"
                              fullWidth
                              value={
                                selectedAccountData.find(
                                  (data) => data.AccountId === importDutyAccountId
                                )?.Description
                              }
                              onChange={(e) => {
                                updateSelectedAccountData(
                                  ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index,
                                  "Description",
                                  e.target.value,
                                  Ids.importDuty.id
                                );
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                    <div
                      style={{
                        display: showSectionexciseduty ? "contents" : "none",}}
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
                              value={excisedutytotalValue.toFixed(2)}
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
                              value={taxabletotal.toFixed(2)}
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
        {additionalCost()}
      </Box>
    </>
  );
};

export default Products;
