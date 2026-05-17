export const selectStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: undefined, // reset default blue
    color: undefined,                // reset default text
    ":active": {
      ...provided[":active"],
      backgroundColor: "#c00034",
      color: "#FFFFFF" // also reset active press state
    },
  }),
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: undefined,
  }),
  input: (provided: any) => ({
    ...provided,
    color: undefined,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: undefined,
  }),
    menu: (provided: any) => ({
    ...provided,
    backgroundColor: "transparent",
    position: "absolute", // Ensure proper positioning
    zIndex: 9999,
    // Remove any transform or positioning that might interfere
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};


export const selectClassNames = {
  control: ({ isFocused }: any) =>
    `rounded-lg border 
     bg-white dark:bg-transparent shadow-none  outline-none border-none  p-0
     hover:border-black/40 dark:hover:border-white/40 font-urbanist`,

  singleValue: () => `text-black dark:text-white font-urbanist`,
  placeholder: () => `text-black/50 dark:text-white/50 font-urbanist`,

  menu: () =>
    `bg-white 
     rounded-lg p-0 z-[9999] font-urbanist`,

  option: ({ isSelected, isFocused }: any) =>
    `font-urbanist cursor-pointer 
     ${isSelected ? "dark:bg-[#c00034] dark:text-white bg-[#f7f7f7] text-black pl4" : isFocused ? "dark:bg-[#c00034] dark:text-white bg-[#f7f7f7] text-black pl4" : "dark:bg-[#0f0f0f] bg-white text-black dark:text-white pl4"} 
     `,

  input: () => `text-black dark:text-white font-urbanist`,
  dropdownIndicator: () =>
    `p-0 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white`,
  menuList: () => `max-h-[150px] overflow-y-auto p-0`,
  indicatorSeparator: () => `hidden`,
};
