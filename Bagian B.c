#include <stdio.h>

int main ()
{
	int JAM, MENIT, DETIK, SISA, SISAA;
	
	printf("Input detik : "); scanf("%i",&DETIK);
	JAM=DETIK/3600;
	SISA=DETIK%3600;
	MENIT=SISA/60;
	SISAA=SISA%60;
	printf("%i jam, %i menit, %i detik\n", JAM, MENIT, SISAA);
	return (0);
}
