'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import * as React from 'react';
import { DialogFooter, DialogHeader } from './dailogHeader';

interface CustomDialogProps {
  triggerLabel: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  showFooter?: boolean;
  confirmDisabled?: boolean;
  isTextTrigger?: boolean;
  height?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  triggerLabel,
  title = 'Dialog Title',
  description,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  showFooter = true,
  confirmDisabled = false,
  isTextTrigger = false,
  height = '600px',
  open: controlledOpen,
  onOpenChange,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange : setUncontrolledOpen;

  const handleConfirm = () => {
    onConfirm?.();
    // Do NOT close the dialog here; let parent control it
    // setOpen(false);
  };

  const renderDialogTrigger = () => {
    if (!triggerLabel) return null;
    return (
      <DialogTrigger asChild>
        {isTextTrigger || typeof triggerLabel === 'object' ? (
          <span className="inline cursor-pointer">{triggerLabel}</span>
        ) : (
          <Button
            showPlusIcon
            type="button"
            className="px-[14px] py-[12.5px] bg-[#4EF162] items-center font-satoshi-variable font-[700px] text-[14px] text-black rounded-[4px] cursor-pointer hover:bg-[#3DBF50]"
          >
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderDialogTrigger()}
      <DialogContent
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-[600px] bg-[#16171B] rounded-lg shadow-lg z-50 overflow-auto border-0 outline-none sm:w-[600px]"
        style={{ height: '90vh', maxHeight: height }}
      >
        <DialogHeader className="hidden">
          <DialogTitle className="text-white items-center font-[700px] text-[22px] justify-center">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-300">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className={`py-2 ${!showFooter ? 'pb-4' : ''}`}>{children}</div>

        {showFooter && (
          <DialogFooter className="p-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-black border-gray-600 cursor-pointer hover:bg-gray-200"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className={`${
                confirmDisabled
                  ? 'bg-[#4EF16266] cursor-not-allowed opacity-50'
                  : 'bg-[#4EF162] hover:bg-[#3DBF50] cursor-pointer'
              } text-black font-medium`}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
