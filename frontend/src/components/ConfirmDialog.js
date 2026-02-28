import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * ConfirmDialog – drop-in replacement for window.confirm()
 *
 * Props:
 *   open       – boolean, controls visibility
 *   title      – string, dialog heading
 *   message    – string, body text
 *   onConfirm  – () => void  called on "Yes, Delete" click
 *   onCancel   – () => void  called on "Cancel" or overlay-dismiss
 *   confirmLabel – string (default "Delete")
 *   destructive  – boolean (default true) – red confirm button
 */
const ConfirmDialog = ({
    open,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    destructive = true,
}) => (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel?.(); }}>
        <DialogContent className="max-w-sm">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{message}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:justify-end mt-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    variant={destructive ? 'destructive' : 'default'}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default ConfirmDialog;
