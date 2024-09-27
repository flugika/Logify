import React, { ReactNode } from 'react';

export interface CategoryInterface {
    ID?:        number;
    Name?:      string;
    Icon: React.ReactNode; // Icon as a required property
}