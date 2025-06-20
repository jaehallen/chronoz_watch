// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {User, Session} from "$lib/types/app-types";
import type { ui as BeerUIFunction } from 'beercss';
declare global {
	interface Window {
		ui: typeof BeerUIFunction
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
