import { test } from '@playwright/test';
import * as pages from '../pages';
import { ProgramPage } from '../pages/ProgramPage';

test('test import', async () => {
    console.log("pages keys:", Object.keys(pages));
    console.log("ProgramPage export direct:", ProgramPage);
    console.log("pages.ProgramPage export index:", pages.ProgramPage);
});
