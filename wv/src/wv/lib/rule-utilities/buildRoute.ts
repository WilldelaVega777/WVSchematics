//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { strings }                           from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Higher Order Functions)
//----------------------------------------------------------------------------------------
import { buildRelativeModulePath }           from './buildRelativeModulePath';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ModuleSchema }                      from '../../typings/wv/schemas/module-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function buildRoute(options: ModuleSchema, modulePath: string) 
{
    const relativeModulePath = buildRelativeModulePath(options, modulePath);
    const moduleName = `${strings.classify(options.name)}Module`;
    const loadChildren = `() => import('${relativeModulePath}').then(m => m.${moduleName})`;
  
    return `{ path: '${options.route}', loadChildren: ${loadChildren} }`;
}