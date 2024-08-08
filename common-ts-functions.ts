/* eslint-disable no-useless-escape */
import { DatePicker, InputNumber, Tooltip, Form } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { ERbacPermissions } from "features/rbac/rbacPermissionsList";
import { IListElement} from "models/interfaces";
import { dateType } from "models/types";
import moment from "moment";
import { deviceDetect, isDesktop, isMobile, isTablet } from "react-device-detect";
import { filterCurrencyValue } from "./formatCurrency";
import { getCustomDate, getDateObject } from "./formatTimePeriod";
import { message } from 'antd';
import { ToastTypeEnum } from 'models/enums/toastTypeEnum';
import { Buffer } from "buffer";

export const decodeQueryStringData = (b64Encoded: string) => {
  return JSON.parse(Buffer.from(b64Encoded, 'base64').toString('ascii'));
};

export const getEncodedData = (data: any) => {
  return Buffer.from(JSON.stringify(data)).toString('base64');
};

export function twoDecimalPlacesNumber(num: any) {
  if (!num || num === null || Number(num) === 0) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatThousandSeparator(amount: number | bigint) {
  if (amount) {
    return new Intl.NumberFormat("en-US").format(amount);
  } else {
    return amount;
  }
}

export const getRandomValue = (type: "number" | "string" | "mixed", length: number = 20) => {
  const crypto = window.crypto;
  var array = new Uint32Array(1);
  switch (type) {
    case "number":
      return crypto.getRandomValues(array)[0];
    case "string":
      const stringWishlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      return Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => stringWishlist[x % stringWishlist.length])
      .join('');
    case "mixed":
      const mixedWishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
      return Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => mixedWishlist[x % mixedWishlist.length])
      .join('');
  }
}

export const addToolTip = (
  data: any,
  placement?: TooltipPlacement | undefined,
  cursorType: string = "default",
  maxCharacterCount: number = 15,
  dataCount: boolean = false,
  overlayInnerStyle: Object = {textTransform: "none"},
  overlayStyle: Object = {textTransform: "none"}
) => {
  if (dataCount) {
    if (data) {
      if (data.length > 1) {
        return (
          <Tooltip
            overlayStyle={overlayStyle}
            overlayInnerStyle={overlayInnerStyle}
            title={`${data.map((each: any) => each)}`}
            arrowPointAtCenter={true}
          >
            <span
              style={{ cursor: cursorType }}
            >{`${data[0]} + ${data.length - 1} more...`}</span>
          </Tooltip>
        );
      } else {
        return data[0];
      }
    }
  } else {
    if (data.length > maxCharacterCount) {
      return (
        <Tooltip
          overlayStyle={overlayStyle}
          overlayInnerStyle={overlayInnerStyle}
          placement={placement ? placement : "rightTop"}
          title={data}
          arrowPointAtCenter={true}
        >
          <span style={{ cursor: cursorType }}>
            {data.slice(0, maxCharacterCount).trim()}...
          </span>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        overlayStyle={overlayStyle}
        overlayInnerStyle={overlayInnerStyle}
        placement={placement ? placement : "rightTop"}
        title={data}
        arrowPointAtCenter={true}
      >
        <span style={{ cursor: cursorType }}>
          {data}
        </span>
      </Tooltip>
    );
  }
};

export const numberShorthand = (input: string | number) => {
  const inputNumber = typeof(input) === 'string' ?  Number.parseFloat(input.replace(/,/g, "")) : input;
  if (inputNumber >= 1000 && inputNumber < 1000000) {
    const temp = (inputNumber / 1000).toFixed(1);
    return `${temp}K`;
  } else if (inputNumber >= 1000000 && inputNumber < 1000000000) {
    const temp = (inputNumber / 1000000).toPrecision(3.1);
    return `${temp}M`;
  } else return input;
};

export const formatAccountingValues = (input: number) => {
  if(isNaN(input)||input===null||input===undefined) {
    return input;
  } else if(input===0) {
    return '-';
  } else if(input < 0){
    return twoDecimalPlacesNumber(input).toLocaleString();
  } else {
    return twoDecimalPlacesNumber(input).toLocaleString();
  }
}

export const formatNumericValues = (input: number) => {
  if(isNaN(input)||input===null||input===undefined) {
    return input;
  } else if(input===0) {
    return '-';
  } else if(input < 0){
    return input.toLocaleString();
  } else {
    return input.toLocaleString();
  }
}

export const formatPercentageValues = (input: number) => {
  if(isNaN(input)||input===null||input===undefined) {
    return input;
  } else if(input===0) {
    return '-';
  } else if(input < 0){
    return `${twoDecimalPlacesNumber(input).toLocaleString()}%`;
  } else {
    return `${twoDecimalPlacesNumber(input).toLocaleString()}%`;
  }
}

export const urlQueryParamsToObject = (querystring: string): any => {
  // parse query string
  const params: any = new URLSearchParams(querystring);
  const obj = {};
  // iterate over all keys
  for (const key of params.keys()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = params.get(key);
    }
  }
  return obj;
};

export const getDatePresetId = (
  allPresets: IListElement[],
  presetName: string
): string | number => {
  return allPresets.filter((preset) => preset.label === presetName)[0].value;
};

export const getDatePresetLabel = (
  allPresets: IListElement[],
  presetId: string | number
): string => {
  return allPresets.filter((preset) => preset.value === presetId)[0].label;
};

export const titleCase = (str: string | undefined) => {
  if (str) {
    return str
      .split(" ")
      .map((word) => word[0]?.toUpperCase() + word?.slice(1)?.toLowerCase())
      .join(" ");
  } else {
    return "";
  }
};

export const getTagClassForEvents = (daysToEvent?: number) => {
  if (daysToEvent !== undefined) {
    if (daysToEvent <= 14) {
      return "danger";
    } else if (daysToEvent >= 15 && daysToEvent <= 30) {
      return "warning";
    } else {
      return "success";
    }
  }
};

export const daysToEventColorCheck = (
  daysToEvent: number,
  from: "grid" | "list"
) => {
  let className = "";
  let toolTipText = "";
  let textColor = '#4171B9';
  if (daysToEvent <= 14) {
    toolTipText = "Event is less than 15 days away";
    className = from === "grid" ? "negative" : "dangerBg";
    textColor = '#9F2533';
  } else if (daysToEvent >= 15 && daysToEvent <= 30) {
    toolTipText = "Event is between 15-30 days away";
    className = from === "grid" ? "warningRank" : "warningBg";
    textColor = '#E39408';
  } else {
    toolTipText = "Event is more than 30 days away";
  }
  return {
    className,
    toolTipText,
    textColor,
  };
};

export const availabilityColorCheck = (
  availabilityId: number | null
) => {
  if (availabilityId === 0) {
    return {
      className: "none",
      toolTipText: "No Availability"
    }
  }
  if (!availabilityId) {
    return {
      className: "",
      toolTipText: "Unknown Availability"
    }
  }
  if (availabilityId === 1) {
    return {
      className: "success",
      toolTipText: "High Availability"
    }
  } 
  if (availabilityId === 2) {
    return {
      className: "warning",
      toolTipText: "Medium Availability"
    }
  }
  if (availabilityId === 3) {
    return {
      className: "danger",
      toolTipText: "Low Availability"
    }
  } 
  if (availabilityId === 4) {
    return {
      className: "tbd",
      toolTipText: "TBD"
    }
  } 
  return {
    className: "",
    toolTipText: ""
  }
};

export const checkValidUrl = (value: string) => {
  const matchpattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:*!%_\+.~#?&/=]*)$/gm;
  return matchpattern.test(value);
};

export const getElementsByClassName = (node: Element, className: string) => {
  const a = [];
  const re = new RegExp('(^| )'+className+'( |$)');
  const els = node.getElementsByTagName("*");
  for(let i=0,j=els.length; i<j; i++)
      if(re.test(els[i].className))a.push(els[i]);
  return a;
}

export const filterSortByRanking = (optionA: any, optionB: any, inputValue: string) => {
  const a = optionA?.label?.toLowerCase();
  const b = optionB?.label?.toLowerCase();
  const i = inputValue && inputValue.toLowerCase();
  const aSortOrder = optionA?.value;
  const bSortOrder = optionB?.value;
  // prioritize exact code match
  if (inputValue && a === i) {
    return -1;
  }
  if (inputValue && b === i) {
    return 1;
  }
  // prioritize earlier matches
  if (
    inputValue &&
    a?.indexOf(i) !== -1 &&
    b?.indexOf(i) !== -1 &&
    a?.indexOf(i) < b?.indexOf(i)
  ) {
    return -1;
  }
  if (
    inputValue &&
    a?.indexOf(i) !== -1 &&
    b?.indexOf(i) !== -1 &&
    a?.indexOf(i) > b?.indexOf(i)
  ) {
    return 1;
  }
  if (
    inputValue &&
    a?.indexOf(i) !== -1 &&
    b?.indexOf(i) === -1
  ) {
    return -1;
  }
  if (
    inputValue &&
    a?.indexOf(i) === -1 &&
    b?.indexOf(i) !== -1
  ) {
    return 1;
  }
  if (!inputValue) {
    return a > b;
  }
  // prioritize sortOrder if exists
  if (aSortOrder && bSortOrder && aSortOrder < bSortOrder) {
    return -1;
  }
  if (aSortOrder && bSortOrder && aSortOrder > bSortOrder) {
    return 1;
  }
  if (
    aSortOrder &&
    bSortOrder &&
    aSortOrder === bSortOrder
  ) {
    return 0;
  }

  return a.localeCompare(b);
}

export const asyncForEach = async (array: any, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const inHandTypes = [
  {value: 0, label: "Now"},
  {value: 1, label: "Days prior to event"},
  {value: 2, label: "Choose a day"}
];

const lastDate = moment().subtract(1, 'days');

export const getInHandDateValue = (
  inHandDateType: number, 
  daysPriorToEvent: number, 
  inHandDate: dateType,
  daysToEvent: number
) => {
  if (inHandDateType === 0) {
    return moment();
  }
  if (inHandDateType === 1) {
    return moment().add((daysToEvent - daysPriorToEvent), 'days');
  }
  return inHandDate;
}

export const getViewInhandDate = (
  inHandDateType: number, 
  daysToEvent: number, 
  eventDate: dateType
) => {
  if (inHandDateType === 1) {
    return (
      <Form.Item
        name={"days_prior_to_event"}
        rules={[
          { required: true, message: "", type: "number" },
        ]}
        wrapperCol={{ xl: { span: 24 } }}
      >
        <InputNumber
          precision={0}
          min={0}
          max={daysToEvent}
          step={1}
          controls={false}
          className={`inputTxtRight`}
        />
      </Form.Item>
    )
  } else if (inHandDateType === 2) {
    return (
      <Form.Item
        name={"in_hand_date"}
        rules={[{ required: true, message: "" }]}
        wrapperCol={{ xl: { span: 24 } }}
      >
        <DatePicker
          allowClear={false}
          className={'ant-picker-white'}
          disabledDate={(current) => {
            return (
              current < lastDate  ||
              current >
                getDateObject(
                  getCustomDate(
                    eventDate,
                    "YYYY-MM-DD"
                  )
                )
            );
          }}
        />
      </Form.Item>
    );
  } else {
    return "";
  }
}

export const getDeviceInfo = () => {
  const deviceInformation = deviceDetect(window.navigator.userAgent);
  let deviceType = null;
  if(isDesktop){
    deviceType = 'desktop';
  }
  else if(isMobile){
    deviceType = 'mobile';
  }
  else if(isTablet){
    deviceType = 'tablet';
  }

  return {
    browserName: deviceInformation.browserName ? deviceInformation.browserName : null,
    browserMajorVersion: deviceInformation.browserMajorVersion ? deviceInformation.browserMajorVersion : null,
    browserFullVersion: deviceInformation.browserFullVersion ? deviceInformation.browserFullVersion : null,
    osName: deviceInformation.osName ? deviceInformation.osName : null,
    osVersion: deviceInformation.osVersion ? deviceInformation.osVersion : null,
    userAgent: deviceInformation.userAgent ? deviceInformation.userAgent : window.navigator.userAgent,
    deviceType: deviceType,
    isDesktop,
    isMobile,
    isTablet
  }
}

export const formatReportCount = (totalCount: number) => {
  if (totalCount > 1) {
    return " Records Found";
  }
  return " Record Found";
}

export const getHeaderData = (reportData: any, type: string) => {
  if (reportData?.aggregate && reportData?.aggregate.length > 0) {
    return reportData.aggregate.map((data: any) => {
      return { ...data, [type]: "Total" };
    });
  }
  return null;
}

export const alert_Ids = {
  less_than_fifteen: 1,
  fifteen_to_thirty: 2,
  costing_issue: 3,
  card_missing: 4
};

export const permissionSet = [
  ERbacPermissions.REPORT_LONG_INVENTORY_VIEW_ALL,
  ERbacPermissions.REPORT_LONG_INVENTORY_VIEW_OWN,
  ERbacPermissions.REPORT_LONG_INVENTORY_VIEW_TEAM
];

export const setCurrencyFormattedData = (
  data: any,
  type: string,
  isCurrencyApplied: boolean = false
) => {
  if (data && data[type]) {
    if (!isCurrencyApplied) {
      return `${data[type]}`;
    }
    return filterCurrencyValue(data[type], true);
  }
  return "-";
};

export const setCurrencyFormattedClass = (
  data: any,
  type: string
) => {
  if (
    data && 
    parseInt(data[type].split(" ")[1]) > 0
  ) {
    switch(type) {
      case "capital_applied":
        return "text-info";
      case "potential_earnings":
        return "text-success";
      default:
        return "text-success";
    }
  }
  return "text-danger";
};

export const getSeatAvailabilityDetails = (data:string) => {
  const score = parseFloat(data);
  
  if (score >= 60.00) {
    return {color:'bg-success', title:'High Availability\n(at least 60% seats available)'};
  } else if (score < 60.00 && score > 40.00) {
    return {color:'bg-warning', title:'Medium Availability\n(41%-59% seats available)'};
  } else if (score <= 40.00 && score > -1.00) {
    return {color:'bg-danger', title:'Low Availability\n(at most 40% seats available)'};
  } else {
    return {color:'defaultBg', title:'No Seat Intelligence Available'};
  }
}

export const getShowTitleRender = (data:any) => {
  for (const eachData of data) {
    if([1,2].includes(eachData.zone_availability_id)){
      return true;
    }
  }
  return false;
}

export const getUserName = (data:any) => {
  if (data?.first_name || data?.last_name) {
    if (data?.first_name && !data?.last_name) {
      return `${data?.first_name}`;
    }
    return `${data?.first_name} ${
      data?.last_name?.trim()[0]
    }`; 
  }
  return null;
}

export const stringifyArrayValues = ( param: any[] | Object ) => {
  if( Array.isArray(param) ) {
    return param?.toString()
  } else {
    const arr = Object.entries(param)?.map((eachEntry) => {
      return ([eachEntry[0], eachEntry[1]?.toString()])
    }).filter((each) => each[1] !== '');
    return Object.fromEntries(arr);
  }
}


const ToastComponent = (toastType: string, key: string, messageText: string ) => {
    if(toastType === ToastTypeEnum.TOAST_LOADING)
        return message.loading({
            content: messageText,
            duration: 0,
            key: key,
            className: "toastMsg loadingMsg",
          });


    if(toastType === ToastTypeEnum.TOAST_SUCCESS)
        return message.success({
            content: messageText,
            key: key,
            duration: 5,
            className: "toastMsg savedSuccess",
          });


    if(toastType === ToastTypeEnum.TOAST_ERROR)
        return message.error({
            content: messageText,
            key: key,
            duration: 5,
            className: "toastMsg savedError",
          })
}

export default ToastComponent;
