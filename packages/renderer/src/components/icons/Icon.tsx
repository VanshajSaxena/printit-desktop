import React from 'react';
import { FileInfo } from './FileInfo';
import { Help } from './Help';
import { Gear } from './Gear';
import { List } from './List';
import { PDFFile } from './PDFFile';
import { Printer } from './Printer';
import { QRCode } from './QRCode';
import { Reject } from './Reject';
import { Sliders } from './Sliders';

const IconMap = {
  'file-icon': FileInfo,
  'help-icon': Help,
  'gear-icon': Gear,
  'list-icon': List,
  'pdf-file-icon': PDFFile,
  'printer-icon': Printer,
  'qr-code-icon': QRCode,
  'reject-icon': Reject,
  'sliders-icon': Sliders,
};

type IconKey = keyof typeof IconMap;

interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  icon: IconKey;
}

export function Icon({ icon, ...rest }: IconProps) {
  const IconComponent = IconMap[icon];

  return <IconComponent stroke="#000" {...rest} />;
}
