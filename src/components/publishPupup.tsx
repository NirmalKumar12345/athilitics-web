import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

type PublishPopupProps = {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function PublishPopup({ open, onConfirm, onCancel }: PublishPopupProps) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent showCloseButton={false} className="bg-[#16171B] border border-[#3C3B3B]">
                <DialogHeader>
                    <DialogTitle className='text-white font-satoshi-bold text-[15px] sm:text-[16px]'>Are you sure you want to publish?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" className='bg-[#16171B] cursor-pointer rounded-md border border-[#4EF162] text-[#43FF7B] hover:bg-[#232323]' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className='bg-[#43FF7B] cursor-pointer text-black hover:bg-[#36cc62]' onClick={onConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
