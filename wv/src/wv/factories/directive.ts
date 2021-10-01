//----------------------------------------------------------------------------------------
// Imports Section (Schematic Libraries)
//----------------------------------------------------------------------------------------
import { apply }                                from '@angular-devkit/schematics';
import { move }                                 from '@angular-devkit/schematics';
import { Rule }                                 from '@angular-devkit/schematics';
import { Tree }                                 from '@angular-devkit/schematics';
import { applyTemplates }                       from '@angular-devkit/schematics';
import { mergeWith }                            from '@angular-devkit/schematics';
import { url }                                  from '@angular-devkit/schematics';
import { chain }                                from '@angular-devkit/schematics';
import { strings }                              from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Utility Functions)
//----------------------------------------------------------------------------------------
import { createDefaultPath }                    from '../lib/utility/workspace';
import { parseName }                            from '../lib/utility/parse-name';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { DirectiveSchema }                      from '../typings/wv/schemas/directive-schema';


//----------------------------------------------------------------------------------------
// Rules Section (Rule for New Projects)
//----------------------------------------------------------------------------------------
export function newDirective(options: DirectiveSchema) : Rule
{
    return async (host: Tree) => 
    {
        if (options.path === undefined) 
        {
            options.path = await createDefaultPath(host, options.project as string);
        }
    
        const parsedPath = parseName(options.path, options.name);
        
        options.name = parsedPath.name;
        options.path = parsedPath.path;
    
        const templateSource = apply(
        url('../files/directive'), 
        [
          applyTemplates({
            ...strings,
            ...options,
          }),
          move(parsedPath.path),
        ]);
    
        return chain([
            mergeWith(templateSource)
        ]);
    };
}