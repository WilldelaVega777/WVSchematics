//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { normalize }               from '@angular-devkit/core';
import { strings }                 from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Utitlity Functions)
//----------------------------------------------------------------------------------------
import { buildRelativePath }       from '../utility/find-module';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ModuleSchema }            from '../../typings/wv/schemas/module-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function buildRelativeModulePath(options: ModuleSchema, modulePath: string): string 
{
    const importModulePath = normalize(
      `/${options.path}/`
      + strings.dasherize(options.name)
      + '.module',
    );
  
    return buildRelativePath(modulePath, importModulePath);
}