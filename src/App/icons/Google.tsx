import React, { forwardRef, SVGAttributes } from "react";

export type GoogleProps = {
  color?: string;
  size?: string | number;
} & SVGAttributes<SVGElement>;

export const Google = forwardRef<SVGSVGElement, GoogleProps>(
  ({ color = "currentColor", size = 24, ...props }, forwardedRef) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      ref={forwardedRef}
      {...props}
    >
      <path d="M22,12.233871 C22,17.9395161 18.0286885,22 12.1639344,22 C6.54098361,22 2,17.5322581 2,12 C2,6.46774194 6.54098361,2 12.1639344,2 C14.9016393,2 17.204918,2.98790323 18.9795082,4.61693548 L16.2131148,7.23387097 C12.5942623,3.7983871 5.8647541,6.37903226 5.8647541,12 C5.8647541,15.4879032 8.69672131,18.3145161 12.1639344,18.3145161 C16.1885246,18.3145161 17.6967213,15.4758065 17.9344262,14.0040323 L12.1639344,14.0040323 L12.1639344,10.5645161 L21.8401639,10.5645161 C21.9344262,11.0766129 22,11.5685484 22,12.233871 Z" />
    </svg>
  )
);
