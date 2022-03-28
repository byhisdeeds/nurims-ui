import {Tooltip} from "@mui/material";
import {styled} from "@mui/material/styles";
import {tooltipClasses} from "@mui/material/Tooltip";
import React from "react";

export const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(14,14,14,0.87)',
    color: 'rgba(231,231,231,0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(14),
    border: '1px solid #dadde9',
  },
}));

export const TooltipText = (props) => {
  return (
    <React.Fragment>
      <div dangerouslySetInnerHTML={{__html: props.htmlText}} />
    </React.Fragment>
  )
}
