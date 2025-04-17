// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {User, Session, BeerUIFunction} from "$lib/app-types";
declare global {
	interface Window {
		ui: BeerUIFunction
	}
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
