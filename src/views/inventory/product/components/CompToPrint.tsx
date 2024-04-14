import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { connect } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { RootState } from "../../../../app/store";
import { useBarcode } from "next-barcode";

interface ComponentToPrintProps {
  QrValue: string;
  imageSize: number;
  imagesNum: number;
  rowGap: number;
  marginTop: number;
  marginLeft: number;
  columnGap: number;
  activeTab: string;
}
interface BarCodeProps {
  value: string;
  height?: number;
  showValue?: boolean;
}

class ComponentToPrint extends React.Component<ComponentToPrintProps> {
  renderImages() {
    return Array.from({ length: this.props.imagesNum }, (_, i) => {
      if (this.props.activeTab === "qrcode") {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <QRCode
              key={i}
              value={this.props.QrValue}
              size={this.props.imageSize}
            />
            <span>{this.props.QrValue}</span>
          </Box>
        );
      } else if (this.props.activeTab === "barcode") {
        return (
          <BarCode
            key={i}
            value={this.props.QrValue}
            height={this.props.imageSize}
            showValue={true}
          />
        );
      }
    });
  }

  render() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: `${this.props.rowGap}px`,
          columnGap: `${this.props.columnGap}px`,
          marginTop: `${this.props.marginTop}px`,
          marginLeft: `${this.props.marginLeft}px`,
        }}
      >
        {this.renderImages()}
      </Box>
    );
  }
}

export function BarCode({
  value,
  height = 100,
  showValue = false,
}: BarCodeProps) {
  const { inputRef } = useBarcode({
    value: value,
    options: {
      margin: 0,
      height: height,
      displayValue: false,
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img ref={inputRef} />
      {showValue ? <span>{value}</span> : null}
    </Box>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    QrValue: state.printqrData?.QrValue || "",
    imageSize: state.printqrData?.printSetting?.imageSize || 120,
    imagesNum: state.printqrData?.printSetting?.imagesNum || 1,
    rowGap: state.printqrData?.printSetting?.rowGap || 1,
    columnGap: state.printqrData?.printSetting?.columnGap || 1,
    marginTop: state.printqrData?.printSetting?.marginTop || 1,
    marginLeft: state.printqrData?.printSetting?.marginLeft || 1,
    activeTab: state.printqrData?.activeTab || "qrcode",
  };
};

const ConnectedComponentToPrint = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(ComponentToPrint);

export default function ClickToPrint() {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Box sx={{ display: "none" }}>
        <ConnectedComponentToPrint ref={componentRef} />
      </Box>
      <Button variant="contained" onClick={handlePrint}>
        Print
      </Button>
    </>
  );
}
