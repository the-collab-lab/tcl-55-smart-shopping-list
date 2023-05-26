import { useRef } from 'react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
	Button,
} from '@chakra-ui/react';

export function Dialog({ isOpen, onClose, handleDelete }) {
	const cancelRef = useRef();

	return (
		<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} isCentered>
			<AlertDialogOverlay
				w="500px"
				h="200px"
				m="auto"
				t="50%"
				l="50%"
				position="absolute"
			>
				<AlertDialogHeader>Delete Item</AlertDialogHeader>
				<AlertDialogBody>Are you sure you want to delete?</AlertDialogBody>
				<AlertDialogFooter>
					<Button onClick={onClose} color="brand.500">
						<p>Cancel</p>
					</Button>
					<Button
						colorScheme="overdue"
						onClick={() => {
							handleDelete();
							onClose();
						}}
						ml={3}
					>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
