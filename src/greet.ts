import {
	$bind,
	Memory as $Memory,
	lazyMemory as $lazyMemory,
	Slice as $Slice,
	OpaqueStruct as $OpaqueStruct
} from 'zbind';

function $defaultPath() {
	return decodeURI(new URL("../dist/addon.wasm", import.meta.url).pathname);
}

const $decoder = new TextDecoder();
const $encoder = new TextEncoder();
const $intMagic = Math.pow(2, 52);
const $slots: CallableFunction[] = [];

export function $create() {
	let $getMemory: () => $Memory;
	let $wrappers: CallableFunction[];
	let $top: number;
	let $mem = $lazyMemory(() => ($init(), $mem));

	function $callback() {
		// TODO: Slot-specific type conversion.
		$slots[$mem.F64[$top]]();
	}

	function $init(source: BufferSource | string = $defaultPath()) {
		const deps = $bind(source, $callback);
		$getMemory = deps.getMemory;
		$wrappers = deps.wrappers;
		$top = deps.stackBase;
		$mem = $getMemory();
	}

	function hello($1: $Slice | string): void {
		const $F64 = $mem.F64;
		const $args = $top;
		$top += 3;
		$F64[$args] = $top + $intMagic;
		if(typeof $1 == "string") {
			const $len = $encoder.encodeInto($1, $mem.U8.subarray($top * 8)).written;
			$F64[$args + 1] = $top * 8 + $mem.base;
			$F64[$args + 2] = $len + $intMagic;
			$top += $len / 8;
		} else {
			$top += $1.toStack($getMemory, $mem, $top, $args + 1) / 8;
		}
		$wrappers[0]();
		$mem = $getMemory();
		$top = $args;
	}

	function hello2($1: $Slice | string): void {
		const $F64 = $mem.F64;
		const $args = $top;
		$top += 3;
		$F64[$args] = $top + $intMagic;
		if(typeof $1 == "string") {
			const $len = $encoder.encodeInto($1, $mem.U8.subarray($top * 8)).written;
			$F64[$args + 1] = $top * 8 + $mem.base;
			$F64[$args + 2] = $len + $intMagic;
			$top += $len / 8;
		} else {
			$top += $1.toStack($getMemory, $mem, $top, $args + 1) / 8;
		}
		$wrappers[1]();
		$mem = $getMemory();
		$top = $args;
	}

	return {
		$init,
		hello,
		hello2
	};
}

export const {
	$init,
	hello,
	hello2
} = $create();
