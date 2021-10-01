//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Core)
//----------------------------------------------------------------------------------------
import { strings }                      from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ViewSchema }                   from '../../typings/wv/schemas/view-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: buildSelector()
//---------------------------------------------------------------------------------------- 
export function buildSelector(options: ViewSchema, projectPrefix: string) 
{
    let selector = strings.dasherize(options.name);

    if (options.prefix) 
    {
        selector = `${options.prefix}-${selector}`;
    } 
    else if (options.prefix === undefined && projectPrefix) 
    {
        selector = `${projectPrefix}-${selector}`;
    }
    
    return selector;
}