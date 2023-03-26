#include <stdio.h>
#include <string.h>

struct Friend{
    char name[100];
    char phoneNumber[20];
    char address[100];
}friends[];
//struct Friend friends[];

//struct Friend friends[] = {
//    {"Dini Noviani", "081225224336", "Pekalongan, Jawa Tengah"},
//    {"Dini Maryati", "081225224337", "Semarang, Jawa Tengah"},
//    {"Fahri", "081225224338", "Jayapura, Papua"},
//    {"Fahrur", "081227224336", "Sintang, Kalimantan Barat"},
//    {"Zafir", "081235294339", "Samarinda, Kalimantan Timur"},
//    {"Ruben", "081205220336", "Malang, Jawa Timur"},
//    {"Tria", "081225224336", "Bandung, Jawa Barat"}
//};


//int i;
int searchFriends(char* nameee) {
    int i, found;
    found=0;
    for (i=0;i<strlen(friends);i++ ){
        if (strstr(friends[i].name, nameee) != NULL) {
            printf("%s %s %s\n", friends[i].name, friends[i].phoneNumber, friends[i].address);
        	found=1;
        }
    }
    return found;
}

int main() {
	int i;
    char namee[100],stopInput;
    stopInput='Y';
    printf("Input data: Name, Phone Number, and Address\n\n");
    i=0;
    
    while(stopInput == 'Y'){
    printf("Name\t\t: ");
	scanf("%[^\n]%*c", friends[i].name);
	printf("Phone Number\t: ");
	scanf("%[^\n]%*c", friends[i].phoneNumber);
	printf("Address\t\t: ");
	scanf("%[^\n]%*c", friends[i].address);
	printf("Want to input data again? (Y/N): ");
	scanf("%[^\n]%*c", &stopInput);
	printf("\n");
	i++;
	}
	
    printf("Enter a name to search: ");
    scanf("%[^\n]%*c", namee);

    int founds;
    founds = searchFriends(namee);
    if (founds != 1 ){
        printf("Data Not Exist\n");
    }

    return 0;
}

//int searchFriends(char* nameee) {
//    int i, found;
//    found=0;
//    for (i=0;i<strlen(friends);i++ ){
//        if (strstr(friends[i].name, nameee) != NULL) {
//            printf("%s %s %s\n", friends[i].name, friends[i].phoneNumber, friends[i].address);
//        	found=1;
//        }
//    }
//    return found;
//}
