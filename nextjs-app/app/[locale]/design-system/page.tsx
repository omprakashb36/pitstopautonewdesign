import React from "react";
import { Logo } from "@/app/components/ui/Logo";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Dropdown } from "@/app/components/ui/Dropdown";
import { Phone } from "@/app/components/ui/Phone";
import { Otp } from "@/app/components/ui/Otp";
import { Search } from "@/app/components/ui/Search";
import { SearchBar } from "@/app/components/ui/SearchBar";
import { ServiceCard } from "@/app/components/ui/ServiceCard";
import { Menu } from "@/app/components/ui/Menu";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8 md:p-16 text-pitstop-oil-black dark:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <header className="border-b border-gray-200 dark:border-gray-800 pb-8">
          <h1 className="text-4xl font-host font-bold">Design System Showcase</h1>
          <p className="mt-2 opacity-60">Pitstop360 UI Components & Tokens</p>
        </header>

        {/* 1. Typography EN & AR */}
        <section className="space-y-6">
          <h2 className="text-2xl font-host font-bold border-b border-gray-200 dark:border-gray-800 pb-2">1 & 2. Typography</h2>
          
          <div className="p-8 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-xl text-pitstop-oil-black dark:text-white space-y-6 mb-8">
            <p className="text-sm opacity-60 uppercase tracking-wider mb-2">Native HTML Tags (Responsive Base Layer)</p>
            <h1>Heading 1 (H1)</h1>
            <h2>Heading 2 (H2)</h2>
            <h3>Heading 3 (H3)</h3>
            <h4>Heading 4 (H4)</h4>
            <h5>Heading 5 (H5)</h5>
            <h6>Heading 6 (H6)</h6>
            <p>This is a standard paragraph (p). It scales dynamically across viewports and switches font automatically based on document direction (RTL/LTR).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-6 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-xl text-pitstop-oil-black dark:text-white">
              <h3 className="text-lg font-bold opacity-60 mb-2">English (Host Grotesk) - Design Tokens</h3>
              
              <div className="space-y-4">
                <p className="text-xs opacity-50 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-1">Display</p>
                <div className="font-host font-extrabold flex flex-col gap-2">
                  <div className="display-l">Display-L (120px)</div>
                  <div className="display-m">Display-M (80px)</div>
                  <div className="display-s">Display-s (50px)</div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-xs opacity-50 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-1">Body</p>
                <div className="font-host font-normal flex flex-col gap-2">
                  <div className="body-xl">Body-XL (30px)</div>
                  <div className="body-l">Body-L (22px)</div>
                  <div className="body-m">Body-M (20px)</div>
                  <div className="body-base">Body (18px)</div>
                  <div className="body-s">Body-S (16px)</div>
                  <div className="body-xs">Body-XS (15px)</div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-xs opacity-50 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 pb-1">Caption</p>
                <div className="font-host font-normal flex flex-col gap-2">
                  <div className="caption-16">Caption-16 (16px)</div>
                  <div className="caption-14">Caption-14 (14px)</div>
                  <div className="caption-12">Caption-12 (12px)</div>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-6 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-xl text-pitstop-oil-black dark:text-white" dir="rtl">
              <h3 className="text-lg font-bold opacity-60" dir="ltr">Arabic (Cairo)</h3>
              <p className="font-cairo font-extrabold text-4xl">القاهرة ExtraBold</p>
              <p className="font-cairo font-bold text-2xl">القاهرة Bold</p>
              <p className="font-cairo font-medium text-xl">القاهرة Medium</p>
              <p className="font-cairo font-normal text-lg">القاهرة Regular</p>
            </div>
          </div>
        </section>

        {/* 3. Logos */}
        <section className="space-y-6">
          <h2 className="text-2xl font-host font-bold border-b border-gray-200 dark:border-gray-800 pb-2">3. Logos</h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="p-8 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-xl flex flex-col gap-4 items-start">
              <p className="text-sm opacity-60">Auto-adapts to theme (Light/Dark):</p>
              <Logo width={200} height={60} />
            </div>
          </div>
        </section>

        {/* 4. Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-host font-bold border-b border-gray-200 dark:border-gray-800 pb-2">4. Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="solid">Solid Button</Button>
            <Button variant="orange">Orange Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="disabled">Disabled Button</Button>
          </div>
        </section>

        {/* 5. Globals */}
        <section className="space-y-8">
          <h2 className="text-2xl font-host font-bold border-b border-gray-200 dark:border-gray-800 pb-2">5. Globals</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Input */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">Input</h3>
              <div className="space-y-4">
                <Input state="Default" />
                <Input state="Filled" defaultValue="Lorem Ipsum" />
                <Input state="Error" errorMessage="This field is required" />
              </div>
            </div>

            {/* Dropdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">Dropdown</h3>
              <div className="space-y-4">
                <Dropdown state="Default">
                  <option>Select Option</option>
                </Dropdown>
                <Dropdown state="Filled">
                  <option>Option Selected</option>
                </Dropdown>
                <Dropdown state="Error">
                  <option>Error State</option>
                </Dropdown>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">Phone</h3>
              <div className="space-y-4">
                <Phone state="Default" />
                <Phone state="Filled" defaultValue="555 8080 889" />
                <Phone state="Error" errorMessage="Invalid phone number" />
                <Phone state="Disabled" />
              </div>
            </div>

            {/* OTP */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">OTP</h3>
              <div className="space-y-4">
                <Otp state="Empty" />
                <Otp state="Filled" value="1234" />
                <Otp state="Error" value="9999" />
              </div>
            </div>

            {/* Search */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">Search</h3>
              <div className="space-y-4">
                <Search state="Default" />
                <Search state="Filled" defaultValue="Oil filter for Audi A4" />
              </div>
            </div>

            {/* Menu */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold opacity-60">Menu</h3>
              <div className="flex gap-8 p-4 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-xl">
                <div>
                  <p className="text-sm mb-4 opacity-60">Default</p>
                  <Menu state="Default" />
                </div>
                <div>
                  <p className="text-sm mb-4 opacity-60">Hover State</p>
                  <Menu state="Hover" />
                </div>
              </div>
            </div>
            
          </div>
          
          <div className="space-y-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
             {/* Search Bar */}
             <div className="space-y-4">
                <h3 className="text-lg font-bold opacity-60">Search Bar</h3>
                <SearchBar />
             </div>

             {/* Service Card */}
             <div className="space-y-4">
                <h3 className="text-lg font-bold opacity-60">Service Card</h3>
                <div className="flex flex-wrap gap-8 p-8 bg-[#f7f7f7] dark:bg-[#0A0A0A] rounded-[40px]">
                  <ServiceCard />
                  <ServiceCard title="Car Care & Detailing" />
                </div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}
