"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

// interface DualRangeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
//   labelPosition?: 'top' | 'bottom';
//   label?: (value: number | undefined) => React.ReactNode;
// }

const DualRangeSlider = React.forwardRef(
  (
    {
      className,
      label,
      labelPosition = "top",
      value: propValue,
      min,
      max,
      ...props
    },
    ref
  ) => {
    // Ensure initialValue is always an array, defaulting to [min, max] if propValue isn't an array.
    // This was slightly adjusted from the original to better handle default cases in JS.
    const initialValue = Array.isArray(propValue)
      ? propValue
      : [min || 0, max || 100];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props} // Spread remaining props here
        value={initialValue} // Pass the ensured array value to the primitive
        min={min} // Explicitly pass min
        max={max} // Explicitly pass max
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {initialValue.map(
          (
            val,
            index // Renamed `value` to `val` to avoid conflict with propValue
          ) => (
            <React.Fragment key={index}>
              <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                {label && (
                  <span
                    className={cn(
                      "absolute flex w-full justify-center",
                      labelPosition === "top" && "-top-7",
                      labelPosition === "bottom" && "top-4"
                    )}
                  >
                    {label(val)}
                  </span>
                )}
              </SliderPrimitive.Thumb>
            </React.Fragment>
          )
        )}
      </SliderPrimitive.Root>
    );
  }
);

DualRangeSlider.propTypes = {
  className: PropTypes.string,
  label: PropTypes.func,
  labelPosition: PropTypes.oneOf(["top", "bottom"]),
  value: PropTypes.arrayOf(PropTypes.number),
  min: PropTypes.number,
  max: PropTypes.number,
  // You might want to add other SliderPrimitive.Root prop types here if needed
};

DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
