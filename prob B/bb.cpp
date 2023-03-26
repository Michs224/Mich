#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main()
{
	int test;
	
	struct data
	{
		int nomor;
		char nama[41];
	}
	plant[1000], swap;
	
	FILE *yey = fopen ("testdata.in", "r");
	
	fscanf(yey, "%d\n", &test);
	for (int i=0; i<test; i++)
	{
		fscanf(yey, "%d#%[^\n]", &plant[i].nomor, &plant[i].nama);
	}
	
	for (int i=1; i<test; i++)
	{
		for (int j=test-1; j>=i; j--)
		{
			if (strcmp(plant[j-1].nama, plant[j].nama) > 0)
			{
				swap = plant[j];
				plant[j] = plant[j-1];
				plant[j-1] = swap;
			}
		}
	}
	
	for (int i=0; i<test; i++)
	{
		printf("%d %s\n", plant[i].nomor, plant[i].nama);
	}
	
	fclose (yey);
}
