"use client";

import { generateInvoicePdf } from '@/utils/pdf/generateInvoicePdf';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export default function BillingHistory() {
  return (
    <Dialog>
      <DialogPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          className="text-[#3DFE6B] bg-none border-none font-satoshi-medium text-base cursor-pointer p-0 h-auto hover:text-[#23eb52] hover:bg-transparent"
        >
          Billing History
        </Button>
      </DialogPrimitive.Trigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden bg-[#16171B] border-[#3C3B3B]">
        <DialogHeader>
          <DialogTitle className="text-white font-satoshi-bold text-base sm:text-lg">
            Billing History
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] w-full">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[700px] md:min-w-full text-xs sm:text-sm">
              <TableHeader>
                <TableRow className="text-xs font-medium border-b border-[#2D2D2D] py-2 sm:py-3.5">
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Plan
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Reference
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Date
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Amount
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Plan Validity Till
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Plan Type
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Status
                  </TableHead>
                  <TableHead className="font-satoshi-regular text-xs sm:text-sm text-white">
                    Invoice
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-white border-b border-[#343434] py-2 sm:py-3.5">
                  <TableCell>
                    <span className="bg-[#4EF162] font-satoshi-medium text-black rounded-[8px] px-2 sm:px-3 py-1 text-xs sm:text-base">
                      Pro Plus Tier
                    </span>
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">
                    INV-C-2025-323334
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">25 Jan 2025</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">₹4,200</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">24 Feb 2025</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">Monthly</TableCell>
                  <TableCell>
                    <span className="text-[#00C314] font-satoshi-regular text-xs sm:text-sm">
                      Active
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="text-[#4EF162] cursor-pointer font-satoshi-regular text-xs sm:text-sm">
                      Download
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow className="text-white border-b border-[#343434] py-2 sm:py-3.5">
                  <TableCell>
                    <span className="bg-[#F4C01E] font-satoshi-medium text-black rounded-[8px] px-2 sm:px-3 py-1 text-xs sm:text-base">
                      Pro Tier
                    </span>
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">
                    INV-C-2025-323334
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">25 Jan 2024</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">₹14,999</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">24 Jan 2025</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">Yearly</TableCell>
                  <TableCell>
                    <span className="text-[#FF4B4B] font-satoshi-regular text-xs sm:text-sm">
                      Expired
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-[#51F162] cursor-pointer font-satoshi-regular text-xs sm:text-sm"
                      onClick={generateInvoicePdf}
                    >
                      Download
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow className="text-white border-b border-[#343434] py-2 sm:py-3.5">
                  <TableCell>
                    <span className="bg-[#F4C01E] font-satoshi-medium text-black rounded-[8px] px-2 sm:px-3 py-1 text-xs sm:text-base">
                      Pro Tier
                    </span>
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">
                    INV-C-2025-323334
                  </TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">25 Jan 2024</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">₹14,999</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">24 Jan 2025</TableCell>
                  <TableCell className="font-satoshi-regular text-xs sm:text-sm">Yearly</TableCell>
                  <TableCell>
                    <span className="text-[#FF4B4B] font-satoshi-regular text-xs sm:text-sm">
                      Expired
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="text-[#51F162] cursor-pointer font-satoshi-regular text-xs sm:text-sm">
                      Download
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
