export function getInvalidPopoverError(): Error {
  return Error('SatPopoverAnchor must be provided an SatPopover component instance.');
}

export function getUnanchoredPopoverError(): Error {
  return Error('SatPopover is not anchored to any SatPopoverAnchor.');
}

export function getInvalidHorizontalAlignError(alignment): Error {
  return Error(generateGenericError('horizontalAlign/xAlign', alignment, ['before', 'start', 'center', 'end', 'after']));
}

export function getInvalidVerticalAlignError(alignment): Error {
  return Error(generateGenericError('verticalAlign/yAlign', alignment, ['above', 'start', 'center', 'end', 'below']));
}

export function getInvalidScrollStrategyError(strategy): Error {
  return Error(generateGenericError('scrollStrategy', strategy, ['noop', 'block', 'reposition', 'close']));
}

function generateGenericError(apiName: string, invalid: any, valid: string[]): string {
  return `Invalid ${apiName}: '${invalid}'. Valid options are ` +
    `${valid.map(v => `'${v}'`).join(', ')}.`;
}
