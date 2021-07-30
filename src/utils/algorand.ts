

export function validateAddress(address: string): boolean {
	if (typeof address !== "string") {
		return false;
	}

	return true //algosdk.isValidAddress(address);
}

export async function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve): void => {
		setTimeout(resolve, milliseconds);
	});
}