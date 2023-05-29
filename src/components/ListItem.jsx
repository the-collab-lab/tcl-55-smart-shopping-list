import { updateItem, deleteItem } from '../api/firebase';
import { isWithinLastDay } from '../utils/dates';
import { ListItemDetails } from './ListItemDetails';
import { Dialog } from './Dialog';
import {
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Box,
	Checkbox,
	useDisclosure,
	Center,
	IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export function ListItem({ item, listId, handleDeleteConfirmation, urgency }) {
	const { id, name, dateLastPurchased, dateNextPurchased, totalPurchases } =
		item;
	const { isOpen, onOpen, onClose } = useDisclosure();

	const lastPurchasedDate = dateLastPurchased?.toDate().toDateString();
	const nextPurchasedDate = dateNextPurchased?.toDate().toDateString();

	const handlePurchase = async (e) => {
		if (e.target.checked) {
			await updateItem(listId, item);
		}
	};

	const handleDeleteItem = async () => {
		const result = await deleteItem(listId, id);
		handleDeleteConfirmation(result, name);
	};

	const urgencyColors = {
		Overdue: '#CE6A92',
		Soon: '#5AA1D8',
		'Kind Of Soon': '#1E5C8B',
		'Not Soon': '#0D324D',
		Inactive: '#7C7582',
	};

	return (
		<>
			<Dialog
				isOpen={isOpen}
				onClose={onClose}
				handleDelete={handleDeleteItem}
				name={name}
			/>
			<AccordionItem key={item.id} borderTop="0px" borderBottom="0px">
				<AccordionButton
					color="text.500"
					_expanded={{
						bg: 'text.500',
						color: 'brand.500',
					}}
					_hover={{
						bg: 'text.500',
						color: 'brand.500',
					}}
				>
					<Box as="span" flex="1" textAlign="left">
						<li className="ListItem" style={{ display: 'block' }}>
							<Checkbox
								size="lg"
								onChange={handlePurchase}
								isChecked={isWithinLastDay(item.dateLastPurchased)}
								colorScheme={urgencyColors[urgency]}
								bg={urgencyColors[urgency]}
								borderRadius="md"
								margin="1"
							></Checkbox>
							<label htmlFor={`mark-${name}-purchased-id-${id}`}>{name}</label>
						</li>
					</Box>

					<IconButton
						aria-label="delete"
						size="sm"
						m="0.5em"
						isActive
						bg="transparent"
						colorScheme="transparent"
						color="currentColor"
						transition="none"
						onClick={(e) => {
							e.stopPropagation();
							onOpen();
						}}
						icon={<DeleteIcon />}
					/>
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel pd={4}>
					<Center>
						<ListItemDetails
							totalPurchases={totalPurchases}
							lastPurchasedDate={lastPurchasedDate}
							nextPurchasedDate={nextPurchasedDate}
						/>
					</Center>
				</AccordionPanel>
			</AccordionItem>
		</>
	);
}
