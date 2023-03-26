#include <stdio.h>
#include <string.h>

struct DoB{
	int day,month,year;
};

struct Mahasiswa{
	char Nama[100];
	char Nim[10];
	struct DoB birthDate;
	float score;
	float status;
};


void status(struct Mahasiswa* s){
	if (s->score > 65.0){
		printf("Status: Lulus");
	}
	else {
	printf("Status: Tidak Lulus");}
//	s->status = s->score > 65.0 ? printf("Lulus") : printf("Tidak");
}

void birthDate(struct Mahasiswa* s){
	scanf("%d",&s->birthDate.day);
	scanf("%d",&s->birthDate.month);
	scanf("%d",&s->birthDate.year);
	
}

void score(struct Mahasiswa* s){
	float avg=0,scores;
//	scanf("%f",&s->score);
	for(int i=0;i<5;i++){
		scanf("%f",&scores);
		avg+=scores;
	}
	s->score=avg/5;
}

//struct alamat{
//	char almt[100];
//};

enum hari {senin, selasa, rabu, kamis, jumat, sabtu, minggu};
enum bulan {jan, feb, mar, apr, mei, jun, jul, agust, sept, okt, nov, des};

int main(){
	
	for(int i=senin; i<=minggu; i++){
		printf("%d ", i);
	}
//	struct Mahasiswa mhs={"Mahasiswa 1","260332801"};
//	int N=2;
//	struct Mahasiswa mhs[N];
//	for(int i=0;i<N;i++){
//	fflush(stdin);
//	scanf("%[^\n]%*c", mhs[i].Nama);
//	scanf("%[^\n]%*c", mhs[i].Nim);
//	fflush(stdin);
//	score(&mhs[i]);
//	birthDate(&mhs[i]);
//	printf("Nama\t: %s\nNIM\t: %s\nScore\t: %f\n", mhs[i].Nama, mhs[i].Nim, mhs[i].score);
//	printf("Tanggal Lahir\t: %d-%d-%d\n", mhs[i].birthDate.day, mhs[i].birthDate.month, mhs[i].birthDate.year);
//	status(&mhs[i]);
//	printf("\n");


	return 0;
}
