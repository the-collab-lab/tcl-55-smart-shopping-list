import { useRef } from 'react';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	Heading,
} from '@chakra-ui/react';

export function Dialog({ isOpen, onClose, handleDelete, name }) {
	const cancelRef = useRef();

	return (
		<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef}>
			<AlertDialogOverlay>
				<AlertDialogContent bg="notSoon.500">
					<AlertDialogHeader>
						<Heading fontSize="xl">Delete Item</Heading>
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure you want to delete {name}?
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button
							onClick={onClose}
							color="brand.500"
							bg="text.500"
							_hover={{
								background: 'approaching.500',
								color: 'text.500',
							}}
						>
							<p>Cancel</p>
						</Button>
						<Button
							color="text.500"
							bg="overdue.500"
							_hover={{
								background: 'approaching.500',
								color: 'text.500',
							}}
							onClick={() => {
								handleDelete();
								onClose();
							}}
							ml={3}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}
