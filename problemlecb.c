#include <stdio.h>

int main()
{
    char N[100];
    scanf("%[^\n]",N);
    printf("#include <stdio.h>\n");
    printf("int main()\n");
    printf("{\n");
    printf("    printf(\"%%s\\n\",\"%s\");\n",&N);
    printf("    return 0;\n");
    printf("}\n");
	return(0);
}
