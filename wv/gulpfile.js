//-----------------------------------------------------------------------
// Imports Section
//-----------------------------------------------------------------------
const gulp                = require('gulp');
const ts                  = require('gulp-typescript');
const filter              = require('gulp-filter');
const del                 = require('del');
const { watch }           = require('gulp');
const { src }             = require('gulp');
const { dest }            = require('gulp');
const rename              = require('gulp-rename');

//-----------------------------------------------------------------------
// Imports Section (TS Config)
//-----------------------------------------------------------------------
const tsProject = ts.createProject('tsconfig.json');


//-----------------------------------------------------------------------
// Public Methods Section: (Actions)
//-----------------------------------------------------------------------
gulp.task('clean', () =>
    del('dist')
);
//-----------------------------------------------------------------------
gulp.task('remove_dts', (func) => {
    del('dist/wv/factories/*.d.ts');
    del('dist/wv/lib/utility/*.d.ts');
    del('dist/wv/lib/rule-utilities/*.d.ts');
    del('dist/wv/lib/Typescript/lib/*.d.ts');
    del('dist/wv/lib/Typescript/BUILD.bazel');
    del('dist/wv/lib/Typescript/LICENSE');
    func();
});
//-----------------------------------------------------------------------
gulp.task('compile_factories', () =>
{
    return src('src/wv/factories/*.ts')
            .pipe(tsProject())
            .pipe(dest('dist/wv/factories'));
});
//-----------------------------------------------------------------------
gulp.task('copy_files', () => 
{
    return src('src/wv/files/**')
            .pipe(dest('dist/wv/files'));

});
//-----------------------------------------------------------------------
gulp.task('copy_schemas', () =>
{
    return src('src/wv/schemas/*.json')
        .pipe(dest('dist/wv/schemas/'));
});
//-----------------------------------------------------------------------
gulp.task('copy_TypeScript', () =>
{
    return src('src/wv/lib/Typescript/**')
        .pipe(dest('dist/wv/lib/Typescript'));
});
//-----------------------------------------------------------------------
gulp.task('compile_libs_utility', () =>
{
    return src('src/wv/lib/utility/*.ts')
            .pipe(tsProject())
            .pipe(dest('dist/wv/lib/utility'));
});
//-----------------------------------------------------------------------
gulp.task('compile_libs_rule_utility', () =>
{
    return src('src/wv/lib/rule-utilities/*.ts')
            .pipe(tsProject())
            .pipe(dest('dist/wv/lib/rule-utilities'));
});
//-----------------------------------------------------------------------
gulp.task('copy_collection', () =>
{
    return src('src/collection.json')
        .pipe(dest('dist'));
}); 
//-----------------------------------------------------------------------
gulp.task('copy_package_json', () =>
{
    return src('src/package-dist.json')
        .pipe(rename('package.json'))
        .pipe(dest('dist'));
}); 

//-----------------------------------------------------------------------
// Public Methods Section (Action Watchers)
//-----------------------------------------------------------------------
// gulp.task('watch_compile', () => 
// {
//     watch(
//         'src/wv/factories/*.ts',
//         { events: 'change' },
//         () => src('src/wv/factories/*.ts')
//                 .pipe(tsProject())
//                 .pipe(dest('dist/wv/factories'))
//     );
// });
// //-----------------------------------------------------------------------
// gulp.task('watch_copy_files', () => 
// {
//     watch(
//         'src/wv/files',
//         { events: 'change' },
//         () => src('src/wv/files/**')
//                 .pipe(dest('dist/wv/files'))
//     );
// });
// //-----------------------------------------------------------------------
// gulp.task('watch_copy_schemas', () =>
// {
//     watch(
//         'src/wv/schemas/*.json',
//         { events: 'change' },
//         () => src('src/wv/schemas/*.json')
//             .pipe(dest('dist/wv/schemas/'))
//     );
// });
// //-----------------------------------------------------------------------
// gulp.task('watch_copy_collection', () =>
// {
//     watch(
//         'src/collection.json',
//         { events: 'change' },
//         () => src('src/collection.json')
//             .pipe(dest('dist'))
//     );
// }); 


//-----------------------------------------------------------------------
// Public Methods Section (Composite Tasks)
//-----------------------------------------------------------------------
gulp.task('build', 

    gulp.series(
        'clean',
        'compile_factories', 
        'compile_libs_utility',
        'compile_libs_rule_utility',
        'copy_files', 
        'copy_schemas', 
        'copy_collection',
        'copy_TypeScript',
        'copy_package_json',
        'remove_dts'
    )
    
);